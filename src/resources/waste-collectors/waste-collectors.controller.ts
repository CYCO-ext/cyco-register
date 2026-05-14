import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CreateWasteCollectorUsecase } from '../../@core/application/usecases/waste-collector/create-waste-collector.usecase';
import { TWasteCollectorInputDTO } from '../../@core/application/dto/input/waste-collector.dto.input';
import { FindAllWasteCollectorsUsecase } from '../../@core/application/usecases/waste-collector/find-all-waste-collectors.usecase';
import { FindWasteCollectorByIdUsecase } from '../../@core/application/usecases/waste-collector/find-waste-collector-by-id.usecase';
import { UpdateWasteCollectorUsecase } from '../../@core/application/usecases/waste-collector/update-waste-collector.usecase';

@Controller('waste-collectors')
export class WasteCollectorsController {
  constructor(
    private readonly createUsecase: CreateWasteCollectorUsecase,
    private readonly findAllUsecase: FindAllWasteCollectorsUsecase,
    private readonly findByIdUsecase: FindWasteCollectorByIdUsecase,
    private readonly updateUsecase: UpdateWasteCollectorUsecase
  ) { }

  @Post()
  create(@Body() createWasteCollectorDto: TWasteCollectorInputDTO) {
    return this.createUsecase.execute(createWasteCollectorDto);
  }

  @Get()
  findAll() {
    return this.findAllUsecase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findByIdUsecase.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateWasteCollectorDto: TWasteCollectorInputDTO) {
    return this.updateUsecase.execute(id, updateWasteCollectorDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.wasteCollectorsService.remove(+id);
  // }
}
