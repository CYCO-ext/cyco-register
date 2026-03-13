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

describe('GeneratorController', () => {
  let controller: GeneratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        }
      ],
    }).compile();

    controller = module.get<GeneratorController>(GeneratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
