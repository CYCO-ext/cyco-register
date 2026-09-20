import { BadRequestException } from '@nestjs/common';
import { Deliveryman } from '../../../domain/entities/deliveryman.entity';
import { User } from '../../../domain/entities/user.entity';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import { IDeliverymanRepository } from '../../../domain/repositories/deliveryman.repository';
import { Password } from '../../../domain/value-objects/password.value-object';
import { Phone } from '../../../domain/value-objects/phone.value-object';
import { ListDeliverymenByCollectorUsecase } from './list-deliverymen-by-collector.usecase';

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

  const deliveryman = Deliveryman.create({
    birthDate: new Date('1990-01-01T00:00:00.000Z'),
    licenseNumber: 'CNH123456',
    wasteCollectorId: 'collector-id',
    user,
    vehicle,
  }).getValue();
  deliveryman.setId('deliveryman-id');
  return deliveryman;
};

describe('ListDeliverymenByCollectorUsecase', () => {
  const repository: jest.Mocked<IDeliverymanRepository> = {
    create: jest.fn(),
    findById: jest.fn(),
    findByWasteCollectorId: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository.findByWasteCollectorId.mockResolvedValue([makeDeliveryman()]);
  });

  it('returns deliverymen from the collector directory', async () => {
    const usecase = new ListDeliverymenByCollectorUsecase(repository);

    const result = await usecase.execute('collector-id');

    expect(repository.findByWasteCollectorId).toHaveBeenCalledWith('collector-id');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: 'deliveryman-id',
        wasteCollectorId: 'collector-id',
        name: 'Driver One',
        vehicle: expect.objectContaining({ plate: 'ABC1234' }),
      }),
    );
  });

  it('rejects a missing collector id', async () => {
    const usecase = new ListDeliverymenByCollectorUsecase(repository);

    await expect(usecase.execute('')).rejects.toBeInstanceOf(BadRequestException);
  });
});
