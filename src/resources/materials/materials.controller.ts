import { Controller, Get } from '@nestjs/common';
import { FindAllMaterialsUsecase } from '../../@core/application/usecases/material/find-all-materials.usecase';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly findAllUsecase: FindAllMaterialsUsecase) { }

  @Get()
  findAll() {
    return this.findAllUsecase.execute();
  }

}
