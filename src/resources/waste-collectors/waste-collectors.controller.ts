import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CreateWasteCollectorUsecase } from '../../@core/application/usecases/waste-collector/create-waste-collector.usecase';
import { TWasteCollectorInputDTO } from '../../@core/application/dto/input/waste-collector.dto.input';
import { FindAllWasteCollectorsUsecase } from '../../@core/application/usecases/waste-collector/find-all-waste-collectors.usecase';
import { FindWasteCollectorByIdUsecase } from '../../@core/application/usecases/waste-collector/find-waste-collector-by-id.usecase';
import { UpdateWasteCollectorUsecase } from '../../@core/application/usecases/waste-collector/update-waste-collector.usecase';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('waste-collectors')
@ApiTags('Coletores')
export class WasteCollectorsController {
  constructor(
    private readonly createUsecase: CreateWasteCollectorUsecase,
    private readonly findAllUsecase: FindAllWasteCollectorsUsecase,
    private readonly findByIdUsecase: FindWasteCollectorByIdUsecase,
    private readonly updateUsecase: UpdateWasteCollectorUsecase
  ) { }

  @Post()
  @ApiOperation({ summary: 'Cadastra uma empresa coletora ou coletor' })
  @ApiBody({ schema: { type: 'object', required: ['email', 'password', 'name', 'phone', 'document', 'isEnterprise', 'materials'], properties: {
    email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' }, name: { type: 'string' }, document: { type: 'string' },
    isEnterprise: { type: 'boolean' }, materials: { type: 'array', items: { type: 'string' } },
    phone: { type: 'object', required: ['ddd', 'ddi', 'number'], properties: { ddd: { type: 'integer' }, ddi: { type: 'integer' }, number: { type: 'string' } } },
    address: { type: 'object', properties: { zipCode: { type: 'string' }, number: { type: 'string' }, complement: { type: 'string' } } },
    enterprise: { type: 'object', properties: { companyName: { type: 'string' } } },
  } } })
  create(@Body() createWasteCollectorDto: TWasteCollectorInputDTO) {
    return this.createUsecase.execute(createWasteCollectorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista coletores cadastrados' })
  findAll() {
    return this.findAllUsecase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um coletor por identificador' })
  findOne(@Param('id') id: string) {
    return this.findByIdUsecase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados do coletor' })
  @ApiBody({ schema: { type: 'object', required: ['email', 'password', 'name', 'phone', 'document', 'isEnterprise', 'materials'], properties: {
    email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' }, name: { type: 'string' }, document: { type: 'string' },
    isEnterprise: { type: 'boolean' }, materials: { type: 'array', items: { type: 'string' } },
    phone: { type: 'object', required: ['ddd', 'ddi', 'number'], properties: { ddd: { type: 'integer' }, ddi: { type: 'integer' }, number: { type: 'string' } } },
    address: { type: 'object', properties: { zipCode: { type: 'string' }, number: { type: 'string' }, complement: { type: 'string' } } },
    enterprise: { type: 'object', properties: { companyName: { type: 'string' } } },
  } } })
  update(@Param('id') id: string, @Body() updateWasteCollectorDto: TWasteCollectorInputDTO) {
    return this.updateUsecase.execute(id, updateWasteCollectorDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.wasteCollectorsService.remove(+id);
  // }
}
