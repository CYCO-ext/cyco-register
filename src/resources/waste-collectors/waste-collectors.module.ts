import { Module } from '@nestjs/common';
import { WasteCollectorsController } from './waste-collectors.controller';
import { YupAdapter } from '../../infra/validation/yup/yup.adapter';
import { WasteCollectorRepositoryImpl } from '../../infra/db/prisma/repositories/waste-collector.prisma-repository';
import { BcryptAdapter } from '../../infra/cryptography/password/bcrypt.adapter';
import { prismaClient } from '../../infra/db/prisma';
import { CreateWasteCollectorUsecase } from '../../@core/application/usecases/waste-collector/create-waste-collector.usecase';
import { IWasteCollectorRepository } from '../../@core/domain/repositories/waste-collector.repository';
import { IPasswordCryptography } from '../../@core/domain/services/password-cryptography.service';
import { TWasteCollectorInputDTO } from '../../@core/application/dto/input/waste-collector.dto.input';
import { IValidator } from '../../@core/domain/services/validator.service';
import { wasteCollectorSchema } from '../../infra/validation/yup/schemas/waste-collector.schema';
import { FindAllWasteCollectorsUsecase } from '../../@core/application/usecases/waste-collector/find-all-waste-collectors.usecase';
import { MaterialRepositoryImpl } from '../../infra/db/prisma/repositories/material.prisma-repository';
import { IMaterialRepository } from '../../@core/domain/repositories/material.repository';

@Module({
  controllers: [WasteCollectorsController],
  providers: [
    { provide: YupAdapter, useClass: YupAdapter },
    { provide: WasteCollectorRepositoryImpl, useFactory: () => new WasteCollectorRepositoryImpl(prismaClient) },
    { provide: MaterialRepositoryImpl, useFactory: () => new MaterialRepositoryImpl(prismaClient) },
    { provide: BcryptAdapter, useFactory: () => new BcryptAdapter(8) },
    {
      provide: CreateWasteCollectorUsecase,
      useFactory: (
        repository: IWasteCollectorRepository,
        materialRepository: IMaterialRepository,
        passwordCryptography: IPasswordCryptography,
        validator: IValidator<TWasteCollectorInputDTO>
      ) => new CreateWasteCollectorUsecase(
        repository,
        materialRepository,
        passwordCryptography,
        validator,
        wasteCollectorSchema
      ),
      inject: [WasteCollectorRepositoryImpl, MaterialRepositoryImpl, BcryptAdapter, YupAdapter]
    },
    {
      provide: FindAllWasteCollectorsUsecase,
      useFactory: (
        repository: IWasteCollectorRepository
      ) => new FindAllWasteCollectorsUsecase(
        repository
      ),
      inject: [WasteCollectorRepositoryImpl]
    },
    // {
    //   provide: AddAddressUsecase,
    //   useFactory: (
    //     repository: IGeneratorRepository,
    //     validator: IValidator<TAddressInputDTO>
    //   ) => new AddAddressUsecase(
    //     repository,
    //     validator,
    //     addressSchema
    //   ),
    //   inject: [GeneratorRepositoryImpl, YupAdapter]
    // }
  ],
})
export class WasteCollectorsModule { }
