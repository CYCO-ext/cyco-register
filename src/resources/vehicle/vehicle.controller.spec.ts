import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { FindAllVehiclesUsecase } from '../../@core/application/usecases/vehicle/find-all-vehicles.usecase';
import { prismaClient } from '../../infra/db/prisma';
import { VehicleRepositoryImpl } from '../../infra/db/prisma/repositories/vehicle.prisma-repository';

describe('VehicleController', () => {
  let controller: VehicleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        { provide: VehicleRepositoryImpl, useFactory: () => new VehicleRepositoryImpl(prismaClient) },
        {
          provide: FindAllVehiclesUsecase,
          useFactory: (
            repository: VehicleRepositoryImpl
          ) => new FindAllVehiclesUsecase(
            repository
          ),
          inject: [VehicleRepositoryImpl]
        }
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
