import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FindAllVehiclesUsecase } from '../../@core/application/usecases/vehicle/find-all-vehicles.usecase';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@Controller('vehicle')
@ApiTags('Veículos')
export class VehicleController {
  constructor(private readonly findAllUsecase: FindAllVehiclesUsecase) { }

  // @Post()
  // create(@Body() createVehicleDto: CreateVehicleDto) {
  //   return this.vehicleService.create(createVehicleDto);
  // }

  @Get()
  @ApiOperation({ summary: 'Lista modelos e veículos disponíveis' })
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
