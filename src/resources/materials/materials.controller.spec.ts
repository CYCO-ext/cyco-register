import { Test, TestingModule } from '@nestjs/testing';
import { MaterialsController } from './materials.controller';
import { FindAllMaterialsUsecase } from '../../@core/application/usecases/material/find-all-materials.usecase';
import { IMaterialRepository } from '../../@core/domain/repositories/material.repository';
import { prismaClient } from '../../infra/db/prisma';
import { MaterialRepositoryImpl } from '../../infra/db/prisma/repositories/material.prisma-repository';

describe('MaterialsController', () => {
  let controller: MaterialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialsController],
      providers: [
        { provide: MaterialRepositoryImpl, useFactory: () => new MaterialRepositoryImpl(prismaClient) },
        {
          provide: FindAllMaterialsUsecase,
          useFactory: (
            repository: IMaterialRepository
          ) => new FindAllMaterialsUsecase(
            repository
          ),
          inject: [MaterialRepositoryImpl]
        }
      ],
    }).compile();

    controller = module.get<MaterialsController>(MaterialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
