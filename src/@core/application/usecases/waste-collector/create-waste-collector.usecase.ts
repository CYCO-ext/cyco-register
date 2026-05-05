import { UnprocessableEntityException } from "@nestjs/common";
import { IWasteCollectorRepository } from "../../../domain/repositories/waste-collector.repository";
import { IPasswordCryptography } from "../../../domain/services/password-cryptography.service";
import { IValidator } from "../../../domain/services/validator.service";
import { Password } from "../../../domain/value-objects/password.value-object";
import { TWasteCollectorInputDTO } from "../../dto/input/waste-collector.dto.input";
import { wasteCollectorFactory } from "../../factories/waste-collector.factory";
import { mapWasteCollectorOutput } from "./map";
import { TWasteCollectorOutputDTO } from "../../dto/output/waste-collector.dto.output";
import { IMaterialRepository } from "../../../domain/repositories/material.repository";
import { IEventProducer } from '../../../domain/services/event-producer.service';

export class CreateWasteCollectorUsecase {
  constructor(
    private readonly wasteCollectorRepository: IWasteCollectorRepository,
    private readonly materialRepository: IMaterialRepository,
    private readonly passwordCryptography: IPasswordCryptography,
    private readonly validator: IValidator<TWasteCollectorInputDTO>,
    private readonly schema: object,
    private readonly eventProducer?: IEventProducer
  ) { }

  async execute(input: TWasteCollectorInputDTO): Promise<TWasteCollectorOutputDTO> {
    const { isValid, errorsResult } = this.validator.validate(this.schema, input)
    if (!isValid) throw new UnprocessableEntityException(errorsResult);

    await Promise.all(input.materials.map(async (material) => {
      const materialEntity = await this.materialRepository.findByName(material);
      if (!materialEntity) {
        throw new UnprocessableEntityException(`Material with name ${material} not found`);
      }
    }));

    const wasteCollector = wasteCollectorFactory(input)
    if (!wasteCollector.isRight()) throw new UnprocessableEntityException(wasteCollector.value.getErrorValue())

    const hashedPassword = await this.passwordCryptography.hash(input.password)
    const password = Password.create({ password: hashedPassword }).getValue()
    const wasteCollectorValue = wasteCollector.value.getValue()
    wasteCollectorValue.getUser().setPassword(password)

    const result = await this.wasteCollectorRepository.create(wasteCollectorValue)
    const output = mapWasteCollectorOutput(result);

    try {
      if (this.eventProducer) {
        const event = this.mapToSyncCollectorEvent(result);
        await this.eventProducer.publish(process.env.KAFKA_COLLECTOR_TOPIC || 'collector-sync', event);
      }
    } catch (err) {
      console.error('Failed to publish collector created event', err);
    }

    return output;
  }

  private mapToSyncCollectorEvent(wasteCollector: any) {
    const materials = wasteCollector.getMaterials ? wasteCollector.getMaterials() : [];
    const address = wasteCollector.getAddress ? wasteCollector.getAddress() : null;
    const user = wasteCollector.getUser ? wasteCollector.getUser() : null;

    return {
      eventType: 'COLLECTOR_CREATED',
      collectorId: wasteCollector.getId(),
      userId: user?.getId(),
      name: user?.getName(),
      address: address ? {
        zipCode: address.getZipCode(),
        number: address.getNumber(),
        complement: address.getComplement()
      } : null,
      acceptedMaterialIds: materials.map((m: any) => (m.getName ? m.getName() : String(m))),
      acceptanceRate: 1.0
    };
  }
}
