import { NotFoundException } from '@nestjs/common';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import { WasteCollector } from '../../../domain/entities/waste-collector.entity';
import { CreateDeliverymanUsecase } from './create-deliveryman.usecase';

const makeInput = () => ({
  email: 'driver@example.com',
  password: '12345678',
  name: 'Driver One',
  phone: {
    ddd: 11,
    ddi: 55,
    number: '961868671',
  },
  birthDate: new Date('1990-01-01T00:00:00.000Z'),
  licenseNumber: 'CNH123456',
  wasteCollectorId: 'collector-id',
  vehicle: {
    id: 'vehicle-id',
    colorId: 'color-id',
    modelId: 'model-id',
    plate: 'ABC1234',
  },
});

const makeVehicle = () => {
  const vehicle = Vehicle.create({
    brand: 'Ford',
    color: 'White',
    model: 'Transit',
    plate: 'ABC1234',
    type: 'Van',
    year: 2024,
  }).getValue();
  vehicle.setId('vehicle-id');
  return vehicle;
};

const makeWasteCollector = () => {
  return {
    getId: () => 'collector-id',
  } as WasteCollector;
};

describe('CreateDeliverymanUsecase', () => {
  const deliverymanRepository = {
    create: jest.fn(),
    findById: jest.fn(),
  };
  const vehicleRepository = {
    findByIdModelAndColor: jest.fn(),
  };
  const wasteCollectorRepository = {
    findById: jest.fn(),
  };
  const passwordCryptography = {
    hash: jest.fn(),
  };
  const validator = {
    validate: jest.fn(),
  };

  const makeUsecase = () =>
    new CreateDeliverymanUsecase(
      deliverymanRepository as any,
      vehicleRepository as any,
      wasteCollectorRepository as any,
      passwordCryptography as any,
      validator as any,
      {},
    );

  beforeEach(() => {
    jest.clearAllMocks();
    validator.validate.mockReturnValue({ isValid: true });
    wasteCollectorRepository.findById.mockResolvedValue(makeWasteCollector());
    vehicleRepository.findByIdModelAndColor.mockResolvedValue(makeVehicle());
    passwordCryptography.hash.mockResolvedValue('hashed-password');
    deliverymanRepository.create.mockImplementation(async (deliveryman) => {
      deliveryman.setId('deliveryman-id');
      deliveryman.getVehicle().setId('vehicle-id');
      return deliveryman;
    });
  });

  it('creates a deliveryman under the validated collector company', async () => {
    const input = makeInput();

    const output = await makeUsecase().execute(input);

    expect(wasteCollectorRepository.findById).toHaveBeenCalledWith(
      'collector-id',
    );
    expect(deliverymanRepository.create).toHaveBeenCalledTimes(1);
    const savedDeliveryman = deliverymanRepository.create.mock.calls[0][0];
    expect(savedDeliveryman.getWasteCollectorId()).toBe('collector-id');
    expect(savedDeliveryman.getUser().getPassword().getPassword()).toBe(
      'hashed-password',
    );
    expect(output).toEqual(
      expect.objectContaining({
        id: 'deliveryman-id',
        wasteCollectorId: 'collector-id',
        email: input.email,
      }),
    );
  });

  it('rejects creation when the owner collector does not exist', async () => {
    wasteCollectorRepository.findById.mockResolvedValue(null);

    await expect(makeUsecase().execute(makeInput())).rejects.toThrow(
      NotFoundException,
    );

    expect(vehicleRepository.findByIdModelAndColor).not.toHaveBeenCalled();
    expect(deliverymanRepository.create).not.toHaveBeenCalled();
  });
});
