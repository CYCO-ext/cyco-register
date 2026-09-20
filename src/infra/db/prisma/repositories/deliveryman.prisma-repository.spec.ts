import { Deliveryman } from '../../../../@core/domain/entities/deliveryman.entity';
import { User } from '../../../../@core/domain/entities/user.entity';
import { Vehicle } from '../../../../@core/domain/entities/vehicle.entity';
import { Password } from '../../../../@core/domain/value-objects/password.value-object';
import { Phone } from '../../../../@core/domain/value-objects/phone.value-object';
import { DeliverymanRepositoryImpl } from './deliveryman.prisma-repository';

const makeDeliveryman = () => {
  const vehicle = Vehicle.create({
    brand: 'Ford',
    color: 'White',
    model: 'Transit',
    plate: 'ABC1234',
    type: 'Van',
    year: 2024,
  }).getValue();
  vehicle.setId('vehicle-id');

  const user = User.create({
    email: 'driver@example.com',
    name: 'Driver One',
    password: Password.create({ password: 'hashed-password' }).getValue(),
    phone: Phone.create({
      ddd: 11,
      ddi: 55,
      number: '961868671',
    }).getValue(),
  }).getValue();

  return Deliveryman.create({
    birthDate: new Date('1990-01-01T00:00:00.000Z'),
    licenseNumber: 'CNH123456',
    wasteCollectorId: 'collector-id',
    user,
    vehicle,
  }).getValue();
};

const prismaDeliverymanResult = {
  id: 'deliveryman-id',
  licenseNumber: 'CNH123456',
  birthDate: new Date('1990-01-01T00:00:00.000Z'),
  user_id: 'user-id',
  waste_collector_id: 'collector-id',
  user: {
    id: 'user-id',
    email: 'driver@example.com',
    password: 'hashed-password',
    phone: '+55 (11) 961868671',
    name: 'Driver One',
  },
  tbl_vehicle_deliveryman: [
    {
      id: 'deliveryman-vehicle-id',
      deliveryman_id: 'deliveryman-id',
      vehicle_id: 'vehicle-id',
      plate: 'ABC1234',
      model_id: 'model-id',
      color_id: 'color-id',
      vehicle: {
        id: 'vehicle-id',
        year: 2024,
        brand: {
          id: 'brand-id',
          brand: 'Ford',
        },
        type: {
          id: 'type-id',
          type: 'Van',
        },
        tbl_vehicle_color: [
          {
            color: {
              id: 'color-id',
              color: 'White',
            },
          },
        ],
        tbl_vehicle_vehicle_model: [
          {
            model: {
              id: 'model-id',
              model: 'Transit',
            },
          },
        ],
      },
    },
  ],
};

describe('DeliverymanRepositoryImpl', () => {
  const prisma = {
    tbl_color: {
      findUnique: jest.fn(),
    },
    tbl_vehicle_model: {
      findUnique: jest.fn(),
    },
    tbl_deliveryman: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.tbl_color.findUnique.mockResolvedValue({
      id: 'color-id',
      color: 'White',
    });
    prisma.tbl_vehicle_model.findUnique.mockResolvedValue({
      id: 'model-id',
      model: 'Transit',
    });
    prisma.tbl_deliveryman.create.mockResolvedValue(prismaDeliverymanResult);
    prisma.tbl_deliveryman.findUnique.mockResolvedValue(prismaDeliverymanResult);
    prisma.tbl_deliveryman.findMany.mockResolvedValue([prismaDeliverymanResult]);
  });

  it('writes the owner collector id when creating a deliveryman', async () => {
    const repository = new DeliverymanRepositoryImpl(prisma as any);

    const result = await repository.create(makeDeliveryman());

    expect(prisma.tbl_deliveryman.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          waste_collector: {
            connect: { id: 'collector-id' },
          },
        }),
      }),
    );
    expect(result.getWasteCollectorId()).toBe('collector-id');
  });

  it('hydrates the owner collector id when reading a deliveryman', async () => {
    const repository = new DeliverymanRepositoryImpl(prisma as any);

    const result = await repository.findById('deliveryman-id');

    expect(prisma.tbl_deliveryman.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'deliveryman-id' },
      }),
    );
    expect(result.getWasteCollectorId()).toBe('collector-id');
  });

  it('lists deliverymen by owner collector id', async () => {
    const repository = new DeliverymanRepositoryImpl(prisma as any);

    const result = await repository.findByWasteCollectorId('collector-id');

    expect(prisma.tbl_deliveryman.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { waste_collector_id: 'collector-id' },
      }),
    );
    expect(result).toHaveLength(1);
    expect(result[0].getWasteCollectorId()).toBe('collector-id');
  });
});
