import { Module } from '@nestjs/common';
import { WasteCollectorsController } from './waste-collectors.controller';
import { YupAdapter } from '../../infra/validation/yup/yup.adapter';
import { WasteCollectorRepositoryImpl } from '../../infra/db/prisma/repositories/waste-collector.prisma-repository';
import { BcryptAdapter } from '../../infra/cryptography/password/bcrypt.adapter';
import { prismaClient } from '../../infra/db/prisma';
import { CreateWasteCollectorUsecase } from '../../@core/application/usecases/waste-collector/create-waste-collector.usecase';
import { IWasteCollectorRepository } from '../../@core/domain/repositories/waste-collector.repository';
import { IPasswordCryptography } from '../../@core/domain/services/password-cryptography.service';
import { TWasteCollectorInputDTO } from '../../@core/application/dto/input/waste-collector.dto.input';
import { IValidator } from '../../@core/domain/services/validator.service';
import { wasteCollectorSchema } from '../../infra/validation/yup/schemas/waste-collector.schema';
import { FindAllWasteCollectorsUsecase } from '../../@core/application/usecases/waste-collector/find-all-waste-collectors.usecase';
import { MaterialRepositoryImpl } from '../../infra/db/prisma/repositories/material.prisma-repository';
import { IMaterialRepository } from '../../@core/domain/repositories/material.repository';
import { KafkaProducerImpl } from '../../infra/kafka/kafka-producer.service';
import { IEventProducer } from '../../@core/domain/services/event-producer.service';
import { FindWasteCollectorByIdUsecase } from '../../@core/application/usecases/waste-collector/find-waste-collector-by-id.usecase';
import { UpdateWasteCollectorUsecase } from '../../@core/application/usecases/waste-collector/update-waste-collector.usecase';

@Module({
  controllers: [WasteCollectorsController],
  providers: [
    { provide: YupAdapter, useClass: YupAdapter },
    { provide: WasteCollectorRepositoryImpl, useFactory: () => new WasteCollectorRepositoryImpl(prismaClient) },
    { provide: MaterialRepositoryImpl, useFactory: () => new MaterialRepositoryImpl(prismaClient) },
    { provide: BcryptAdapter, useFactory: () => new BcryptAdapter(8) },
    { provide: KafkaProducerImpl, useFactory: () => new KafkaProducerImpl((process.env.KAFKA_BROKERS || 'localhost:29092').split(','), process.env.KAFKA_COLLECTOR_TOPIC || 'collector-sync') },
    {
      provide: CreateWasteCollectorUsecase,
      useFactory: (
        repository: IWasteCollectorRepository,
        materialRepository: IMaterialRepository,
        passwordCryptography: IPasswordCryptography,
        validator: IValidator<TWasteCollectorInputDTO>,
        eventProducer: KafkaProducerImpl
      ) => new CreateWasteCollectorUsecase(
        repository,
        materialRepository,
        passwordCryptography,
        validator,
        wasteCollectorSchema,
        eventProducer
      ),
      inject: [WasteCollectorRepositoryImpl, MaterialRepositoryImpl, BcryptAdapter, YupAdapter, KafkaProducerImpl]
    },
    {
      provide: FindAllWasteCollectorsUsecase,
      useFactory: (
        repository: IWasteCollectorRepository
      ) => new FindAllWasteCollectorsUsecase(
        repository
      ),
      inject: [WasteCollectorRepositoryImpl]
    },
    {
      provide: FindWasteCollectorByIdUsecase,
      useFactory: (
        repository: IWasteCollectorRepository
      ) => new FindWasteCollectorByIdUsecase(
        repository
      ),
      inject: [WasteCollectorRepositoryImpl]
    },
    {
      provide: UpdateWasteCollectorUsecase,
      useFactory: (
        repository: IWasteCollectorRepository,
        materialRepository: IMaterialRepository,
        passwordCryptography: IPasswordCryptography,
        validator: IValidator<TWasteCollectorInputDTO>,
        eventProducer: KafkaProducerImpl
      ) => new UpdateWasteCollectorUsecase(
        repository,
        materialRepository,
        passwordCryptography,
        validator,
        wasteCollectorSchema,
        eventProducer
      ),
      inject: [WasteCollectorRepositoryImpl, MaterialRepositoryImpl, BcryptAdapter, YupAdapter, KafkaProducerImpl]
    }
    // {
    //   provide: AddAddressUsecase,
    //   useFactory: (
    //     repository: IGeneratorRepository,
    //     validator: IValidator<TAddressInputDTO>
    //   ) => new AddAddressUsecase(
    //     repository,
    //     validator,
    //     addressSchema
    //   ),
    //   inject: [GeneratorRepositoryImpl, YupAdapter]
    // }
  ],
})
export class WasteCollectorsModule { }
