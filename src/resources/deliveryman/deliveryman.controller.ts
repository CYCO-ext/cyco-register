import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters } from '@nestjs/common';
import { CreateDeliverymanUsecase } from '../../@core/application/usecases/deliveryman/create-deliveryman.usecase';
import { TDeliverymanInputDTO } from '../../@core/application/dto/input/deliveryman.dto.input';
import { FindDeliverymanByIdUsecase } from '../../@core/application/usecases/deliveryman/find-deliveryman-by-id.usecase';
import { ListDeliverymenByCollectorUsecase } from '../../@core/application/usecases/deliveryman/list-deliverymen-by-collector.usecase';
import { PrismaClientExceptionFilter } from '../../infra/error/prisma-client.exception-filter';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('deliveryman')
@ApiTags('Entregadores')
@UseFilters(PrismaClientExceptionFilter)
export class DeliverymanController {
  constructor(
    private readonly createUsecase: CreateDeliverymanUsecase,
    private readonly findByIdUsecase: FindDeliverymanByIdUsecase,
    private readonly listByCollectorUsecase: ListDeliverymenByCollectorUsecase
  ) { }

  @Post()
  @ApiOperation({ summary: 'Cadastra um entregador vinculado a um coletor' })
  @ApiBody({ schema: { type: 'object', required: ['email', 'password', 'name', 'phone', 'birthDate', 'licenseNumber', 'wasteCollectorId', 'vehicle'], properties: {
    email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' }, name: { type: 'string' },
    birthDate: { type: 'string', format: 'date-time' }, licenseNumber: { type: 'string' }, wasteCollectorId: { type: 'string', format: 'uuid' },
    phone: { type: 'object', required: ['ddd', 'ddi', 'number'], properties: { ddd: { type: 'integer' }, ddi: { type: 'integer' }, number: { type: 'string' } } },
    vehicle: { type: 'object', required: ['id', 'colorId', 'modelId', 'plate'], properties: { id: { type: 'string' }, colorId: { type: 'string' }, modelId: { type: 'string' }, plate: { type: 'string' } } },
  } } })
  create(@Body() createDeliverymanDto: TDeliverymanInputDTO) {
    return this.createUsecase.execute(createDeliverymanDto);
  }

  // @Get()
  // findAll() {
  //   return this.deliverymanService.findAll();
  // }

  @Get('collector/:collectorId')
  @ApiOperation({ summary: 'Lista entregadores de um coletor' })
  findByCollector(@Param('collectorId') collectorId: string) {
    return this.listByCollectorUsecase.execute(collectorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um entregador por identificador' })
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
