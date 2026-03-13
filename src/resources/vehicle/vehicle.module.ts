import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { VehicleRepositoryImpl } from '../../infra/db/prisma/repositories/vehicle.prisma-repository';
import { FindAllVehiclesUsecase } from '../../@core/application/usecases/vehicle/find-all-vehicles.usecase';
import { prismaClient } from '../../infra/db/prisma';

@Module({
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
})
export class VehicleModule { }
