import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, Put } from '@nestjs/common';
import { CreateGeneratorUsecase } from '../../@core/application/usecases/generator/create-generator.usecase';
import { TGeneratorInputDTO } from '../../@core/application/dto/input/generator.dto.input';
import { FindGeneratorByIdUsecase } from '../../@core/application/usecases/generator/find-generator-by-id.usecase';
import { PrismaClientExceptionFilter } from '../../infra/error/prisma-client.exception-filter';
import { AddAddressUsecase } from '../../@core/application/usecases/generator/add-address.usecase';
import { TAddressInputDTO } from '../../@core/application/dto/input/address.dto.input';
import { UpdateGeneratorUsecase } from '../../@core/application/usecases/generator/update-generator.usecase';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('generator')
@ApiTags('Geradores')
@UseFilters(PrismaClientExceptionFilter)
export class GeneratorController {
  constructor(
    private readonly createUsecase: CreateGeneratorUsecase,
    private readonly findByIdUsecase: FindGeneratorByIdUsecase,
    private readonly addAddressUsecase: AddAddressUsecase,
    private readonly updateUsecase: UpdateGeneratorUsecase
  ) { }

  @Post()
  @ApiOperation({ summary: 'Cadastra uma empresa geradora' })
  @ApiBody({ schema: { type: 'object', required: ['email', 'password', 'name', 'phone', 'address', 'birthDate', 'document'], properties: {
    email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' },
    name: { type: 'string' }, document: { type: 'string' }, birthDate: { type: 'string', format: 'date-time' },
    phone: { type: 'object', required: ['ddd', 'ddi', 'number'], properties: { ddd: { type: 'integer' }, ddi: { type: 'integer' }, number: { type: 'string' } } },
    address: { type: 'object', required: ['zipCode', 'number'], properties: { zipCode: { type: 'string' }, number: { type: 'string' }, complement: { type: 'string' } } },
  } } })
  create(@Body() createGeneratorDto: TGeneratorInputDTO) {
    return this.createUsecase.execute(createGeneratorDto);
  }

  // @Get()
  // findAll() {
  //   return this.generatorService.findAll();
  // }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um gerador por identificador' })
  findOne(@Param('id') id: string) {
    return this.findByIdUsecase.execute(id);
  }

  @Post(':id/address')
  @ApiOperation({ summary: 'Adiciona um endereço ao gerador' })
  @ApiBody({ schema: { type: 'object', required: ['zipCode', 'number'], properties: {
    zipCode: { type: 'string' }, number: { type: 'string' }, complement: { type: 'string' },
  } } })
  addAddress(@Param('id') id: string, @Body() address: TAddressInputDTO) {
    return this.addAddressUsecase.execute(address, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados do gerador' })
  @ApiBody({ schema: { type: 'object', required: ['email', 'password', 'name', 'phone', 'address', 'birthDate', 'document'], properties: {
    email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' },
    name: { type: 'string' }, document: { type: 'string' }, birthDate: { type: 'string', format: 'date-time' },
    phone: { type: 'object', required: ['ddd', 'ddi', 'number'], properties: { ddd: { type: 'integer' }, ddi: { type: 'integer' }, number: { type: 'string' } } },
    address: { type: 'object', required: ['zipCode', 'number'], properties: { zipCode: { type: 'string' }, number: { type: 'string' }, complement: { type: 'string' } } },
  } } })
  update(@Param('id') id: string, @Body() updateGeneratorDto: TGeneratorInputDTO) {
    return this.updateUsecase.execute(id, updateGeneratorDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.generatorService.remove(+id);
  // }
}
