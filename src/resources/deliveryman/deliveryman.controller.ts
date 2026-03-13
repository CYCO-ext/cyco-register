import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters } from '@nestjs/common';
import { CreateDeliverymanUsecase } from '../../@core/application/usecases/deliveryman/create-deliveryman.usecase';
import { TDeliverymanInputDTO } from '../../@core/application/dto/input/deliveryman.dto.input';
import { FindDeliverymanByIdUsecase } from '../../@core/application/usecases/deliveryman/find-deliveryman-by-id.usecase';
import { PrismaClientExceptionFilter } from '../../infra/error/prisma-client.exception-filter';

@Controller('deliveryman')
@UseFilters(PrismaClientExceptionFilter)
export class DeliverymanController {
  constructor(
    private readonly createUsecase: CreateDeliverymanUsecase,
    private readonly findByIdUsecase: FindDeliverymanByIdUsecase
  ) { }

  @Post()
  create(@Body() createDeliverymanDto: TDeliverymanInputDTO) {
    return this.createUsecase.execute(createDeliverymanDto);
  }

  // @Get()
  // findAll() {
  //   return this.deliverymanService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findByIdUsecase.execute(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDeliverymanDto: UpdateDeliverymanDto) {
  //   return this.deliverymanService.update(+id, updateDeliverymanDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.deliverymanService.remove(+id);
  // }
}
