import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { CreateGeneratorUsecase } from '../../@core/application/usecases/generator/create-generator.usecase';
import { GeneratorRepositoryImpl } from '../../infra/db/prisma/repositories/generator.prisma-repository';
import { IGeneratorRepository } from '../../@core/domain/repositories/generator.repository';
import { prismaClient } from '../../infra/db/prisma';
import { BcryptAdapter } from '../../infra/cryptography/password/bcrypt.adapter';
import { YupAdapter } from '../../infra/validation/yup/yup.adapter';
import { generatorSchema } from '../../infra/validation/yup/schemas/generator.schema';
import { IPasswordCryptography } from '../../@core/domain/services/password-cryptography.service';
import { TGeneratorInputDTO } from '../../@core/application/dto/input/generator.dto.input';
import { IValidator } from '../../@core/domain/services/validator.service';
import { FindGeneratorByIdUsecase } from '../../@core/application/usecases/generator/find-generator-by-id.usecase';
import { TAddressInputDTO } from '../../@core/application/dto/input/address.dto.input';
import { AddAddressUsecase } from '../../@core/application/usecases/generator/add-address.usecase';
import { addressSchema } from '../../infra/validation/yup/schemas/address.schema';

@Module({
  controllers: [GeneratorController],
  providers: [
    { provide: YupAdapter, useClass: YupAdapter },
    { provide: GeneratorRepositoryImpl, useFactory: () => new GeneratorRepositoryImpl(prismaClient) },
    { provide: BcryptAdapter, useFactory: () => new BcryptAdapter(8) },
    {
      provide: CreateGeneratorUsecase,
      useFactory: (
        repository: IGeneratorRepository,
        passwordCryptography: IPasswordCryptography,
        validator: IValidator<TGeneratorInputDTO>
      ) => new CreateGeneratorUsecase(
        repository,
        passwordCryptography,
        validator,
        generatorSchema
      ),
      inject: [GeneratorRepositoryImpl, BcryptAdapter, YupAdapter]
    },
    {
      provide: FindGeneratorByIdUsecase,
      useFactory: (
        repository: IGeneratorRepository
      ) => new FindGeneratorByIdUsecase(
        repository
      ),
      inject: [GeneratorRepositoryImpl]
    },
    {
      provide: AddAddressUsecase,
      useFactory: (
        repository: IGeneratorRepository,
        validator: IValidator<TAddressInputDTO>
      ) => new AddAddressUsecase(
        repository,
        validator,
        addressSchema
      ),
      inject: [GeneratorRepositoryImpl, YupAdapter]
    }
  ],
})
export class GeneratorModule { }
