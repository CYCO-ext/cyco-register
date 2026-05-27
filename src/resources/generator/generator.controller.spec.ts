import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorController } from './generator.controller';
import { TGeneratorInputDTO } from '../../@core/application/dto/input/generator.dto.input';
import { CreateGeneratorUsecase } from '../../@core/application/usecases/generator/create-generator.usecase';
import { FindGeneratorByIdUsecase } from '../../@core/application/usecases/generator/find-generator-by-id.usecase';
import { IGeneratorRepository } from '../../@core/domain/repositories/generator.repository';
import { IPasswordCryptography } from '../../@core/domain/services/password-cryptography.service';
import { IValidator } from '../../@core/domain/services/validator.service';
import { BcryptAdapter } from '../../infra/cryptography/password/bcrypt.adapter';
import { prismaClient } from '../../infra/db/prisma';
import { GeneratorRepositoryImpl } from '../../infra/db/prisma/repositories/generator.prisma-repository';
import { generatorSchema } from '../../infra/validation/yup/schemas/generator.schema';
import { YupAdapter } from '../../infra/validation/yup/yup.adapter';
import { AddAddressUsecase } from '../../@core/application/usecases/generator/add-address.usecase';
import { TAddressInputDTO } from '../../@core/application/dto/input/address.dto.input';
import { addressSchema } from '../../infra/validation/yup/schemas/address.schema';
import { KafkaProducerImpl } from '../../infra/kafka/kafka-producer.service';
import { UpdateGeneratorUsecase } from '../../@core/application/usecases/generator/update-generator.usecase';
import { UserRepositoryImpl } from '../../infra/db/prisma/repositories/user.prisma-repository';
import { IUserRepository } from '../../@core/domain/repositories/user-repository.repository';

describe('GeneratorController', () => {
  let controller: GeneratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneratorController],
      providers: [
        { provide: YupAdapter, useClass: YupAdapter },
        { provide: GeneratorRepositoryImpl, useFactory: () => new GeneratorRepositoryImpl(prismaClient) },
        { provide: UserRepositoryImpl, useFactory: () => new UserRepositoryImpl(prismaClient) },
        { provide: BcryptAdapter, useFactory: () => new BcryptAdapter(8) },
        { provide: KafkaProducerImpl, useFactory: () => new KafkaProducerImpl(['localhost:29092'], 'addresses-sync') },
        {
          provide: CreateGeneratorUsecase,
          useFactory: (
            repository: IGeneratorRepository,
            userRepository: IUserRepository,
            passwordCryptography: IPasswordCryptography,
            validator: IValidator<TGeneratorInputDTO>,
            eventProducer: KafkaProducerImpl
          ) => new CreateGeneratorUsecase(
            repository,
            userRepository,
            passwordCryptography,
            validator,
            generatorSchema,
            eventProducer
          ),
          inject: [GeneratorRepositoryImpl, UserRepositoryImpl, BcryptAdapter, YupAdapter, KafkaProducerImpl]
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
        },
        {
          provide: UpdateGeneratorUsecase,
          useFactory: (
            repository: IGeneratorRepository,
            passwordCryptography: IPasswordCryptography,
            validator: IValidator<TGeneratorInputDTO>,
            eventProducer: KafkaProducerImpl
          ) => new UpdateGeneratorUsecase(
            repository,
            passwordCryptography,
            validator,
            generatorSchema,
            eventProducer
          ),
          inject: [GeneratorRepositoryImpl, BcryptAdapter, YupAdapter, KafkaProducerImpl]
        }
      ],
    }).compile();

    controller = module.get<GeneratorController>(GeneratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
