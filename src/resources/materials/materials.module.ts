import { Module } from '@nestjs/common';
import { MaterialsController } from './materials.controller';
import { MaterialRepositoryImpl } from '../../infra/db/prisma/repositories/material.prisma-repository';
import { FindAllMaterialsUsecase } from '../../@core/application/usecases/material/find-all-materials.usecase';
import { IMaterialRepository } from '../../@core/domain/repositories/material.repository';
import { prismaClient } from '../../infra/db/prisma';

@Module({
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
})
export class MaterialsModule { }
