import { Test, TestingModule } from '@nestjs/testing';
import { WasteCollectorsController } from './waste-collectors.controller';
import { TWasteCollectorInputDTO } from '../../@core/application/dto/input/waste-collector.dto.input';
import { CreateWasteCollectorUsecase } from '../../@core/application/usecases/waste-collector/create-waste-collector.usecase';
import { IWasteCollectorRepository } from '../../@core/domain/repositories/waste-collector.repository';
import { IPasswordCryptography } from '../../@core/domain/services/password-cryptography.service';
import { IValidator } from '../../@core/domain/services/validator.service';
import { BcryptAdapter } from '../../infra/cryptography/password/bcrypt.adapter';
import { prismaClient } from '../../infra/db/prisma';
import { WasteCollectorRepositoryImpl } from '../../infra/db/prisma/repositories/waste-collector.prisma-repository';
import { wasteCollectorSchema } from '../../infra/validation/yup/schemas/waste-collector.schema';
import { YupAdapter } from '../../infra/validation/yup/yup.adapter';
import { FindAllWasteCollectorsUsecase } from '../../@core/application/usecases/waste-collector/find-all-waste-collectors.usecase';

describe('WasteCollectorsController', () => {
  let controller: WasteCollectorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WasteCollectorsController],
      providers: [
        { provide: YupAdapter, useClass: YupAdapter },
        { provide: WasteCollectorRepositoryImpl, useFactory: () => new WasteCollectorRepositoryImpl(prismaClient) },
        { provide: BcryptAdapter, useFactory: () => new BcryptAdapter(8) },
        {
          provide: CreateWasteCollectorUsecase,
          useFactory: (
            repository: IWasteCollectorRepository,
            passwordCryptography: IPasswordCryptography,
            validator: IValidator<TWasteCollectorInputDTO>
          ) => new CreateWasteCollectorUsecase(
            repository,
            passwordCryptography,
            validator,
            wasteCollectorSchema
          ),
          inject: [WasteCollectorRepositoryImpl, BcryptAdapter, YupAdapter]
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
      ],
    }).compile();

    controller = module.get<WasteCollectorsController>(WasteCollectorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
