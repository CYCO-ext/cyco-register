import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FindAllVehiclesUsecase } from '../../@core/application/usecases/vehicle/find-all-vehicles.usecase';


@Controller('vehicle')
export class VehicleController {
  constructor(private readonly findAllUsecase: FindAllVehiclesUsecase) { }

  // @Post()
  // create(@Body() createVehicleDto: CreateVehicleDto) {
  //   return this.vehicleService.create(createVehicleDto);
  // }

  @Get()
  findAll() {
    return this.findAllUsecase.execute();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.vehicleService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
  //   return this.vehicleService.update(+id, updateVehicleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.vehicleService.remove(+id);
  // }
}
