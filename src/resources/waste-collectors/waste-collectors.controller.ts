import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateWasteCollectorUsecase } from '../../@core/application/usecases/waste-collector/create-waste-collector.usecase';
import { TWasteCollectorInputDTO } from '../../@core/application/dto/input/waste-collector.dto.input';
import { FindAllWasteCollectorsUsecase } from '../../@core/application/usecases/waste-collector/find-all-waste-collectors.usecase';

@Controller('waste-collectors')
export class WasteCollectorsController {
  constructor(
    private readonly createUsecase: CreateWasteCollectorUsecase,
    private readonly findAllUsecase: FindAllWasteCollectorsUsecase
  ) { }

  @Post()
  create(@Body() createWasteCollectorDto: TWasteCollectorInputDTO) {
    return this.createUsecase.execute(createWasteCollectorDto);
  }

  @Get()
  findAll() {
    return this.findAllUsecase.execute();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.wasteCollectorsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWasteCollectorDto: UpdateWasteCollectorDto) {
  //   return this.wasteCollectorsService.update(+id, updateWasteCollectorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.wasteCollectorsService.remove(+id);
  // }
}
