import { Controller, Get } from '@nestjs/common';
import { FindAllMaterialsUsecase } from '../../@core/application/usecases/material/find-all-materials.usecase';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('materials')
@ApiTags('Materiais')
export class MaterialsController {
  constructor(private readonly findAllUsecase: FindAllMaterialsUsecase) { }

  @Get()
  @ApiOperation({ summary: 'Lista materiais recicláveis disponíveis' })
  findAll() {
    return this.findAllUsecase.execute();
  }

}
