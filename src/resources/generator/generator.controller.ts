import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters } from '@nestjs/common';
import { CreateGeneratorUsecase } from '../../@core/application/usecases/generator/create-generator.usecase';
import { TGeneratorInputDTO } from '../../@core/application/dto/input/generator.dto.input';
import { FindGeneratorByIdUsecase } from '../../@core/application/usecases/generator/find-generator-by-id.usecase';
import { PrismaClientExceptionFilter } from '../../infra/error/prisma-client.exception-filter';
import { AddAddressUsecase } from '../../@core/application/usecases/generator/add-address.usecase';
import { TAddressInputDTO } from '../../@core/application/dto/input/address.dto.input';

@Controller('generator')
@UseFilters(PrismaClientExceptionFilter)
export class GeneratorController {
  constructor(
    private readonly createUsecase: CreateGeneratorUsecase,
    private readonly findByIdUsecase: FindGeneratorByIdUsecase,
    private readonly addAddressUsecase: AddAddressUsecase
  ) { }

  @Post()
  create(@Body() createGeneratorDto: TGeneratorInputDTO) {
    return this.createUsecase.execute(createGeneratorDto);
  }

  // @Get()
  // findAll() {
  //   return this.generatorService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findByIdUsecase.execute(id);
  }

  @Post(':id/address')
  addAddress(@Param('id') id: string, @Body() address: TAddressInputDTO) {
    return this.addAddressUsecase.execute(address, id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.generatorService.remove(+id);
  // }
}
