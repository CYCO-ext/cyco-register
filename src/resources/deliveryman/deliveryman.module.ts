import { Module } from '@nestjs/common';
import { DeliverymanController } from './deliveryman.controller';
import { YupAdapter } from '../../infra/validation/yup/yup.adapter';
import { DeliverymanRepositoryImpl } from '../../infra/db/prisma/repositories/deliveryman.prisma-repository';
import { prismaClient } from '../../infra/db/prisma';
import { BcryptAdapter } from '../../infra/cryptography/password/bcrypt.adapter';
import { VehicleRepositoryImpl } from '../../infra/db/prisma/repositories/vehicle.prisma-repository';
import { CreateDeliverymanUsecase } from '../../@core/application/usecases/deliveryman/create-deliveryman.usecase';
import { IDeliverymanRepository } from '../../@core/domain/repositories/deliveryman.repository';
import { IVehicleRepository } from '../../@core/domain/repositories/vehicle.repository';
import { TDeliverymanInputDTO } from '../../@core/application/dto/input/deliveryman.dto.input';
import { IPasswordCryptography } from '../../@core/domain/services/password-cryptography.service';
import { IValidator } from '../../@core/domain/services/validator.service';
import { deliverymanSchema } from '../../infra/validation/yup/schemas/deliveryman.schema';
import { FindDeliverymanByIdUsecase } from '../../@core/application/usecases/deliveryman/find-deliveryman-by-id.usecase';

@Module({
  controllers: [DeliverymanController],
  providers: [
    { provide: YupAdapter, useClass: YupAdapter },
    { provide: DeliverymanRepositoryImpl, useFactory: () => new DeliverymanRepositoryImpl(prismaClient) },
    { provide: VehicleRepositoryImpl, useFactory: () => new VehicleRepositoryImpl(prismaClient) },
    { provide: BcryptAdapter, useFactory: () => new BcryptAdapter(8) },
    {
      provide: CreateDeliverymanUsecase,
      useFactory: (
        repository: IDeliverymanRepository,
        vehicleRepository: IVehicleRepository,
        passwordCryptography: IPasswordCryptography,
        validator: IValidator<TDeliverymanInputDTO>
      ) => new CreateDeliverymanUsecase(
        repository,
        vehicleRepository,
        passwordCryptography,
        validator,
        deliverymanSchema
      ),
      inject: [DeliverymanRepositoryImpl, VehicleRepositoryImpl, BcryptAdapter, YupAdapter]
    },
    {
      provide: FindDeliverymanByIdUsecase,
      useFactory: (
        repository: IDeliverymanRepository
      ) => new FindDeliverymanByIdUsecase(
        repository
      ),
      inject: [DeliverymanRepositoryImpl]
    }
  ],
})
export class DeliverymanModule { }
