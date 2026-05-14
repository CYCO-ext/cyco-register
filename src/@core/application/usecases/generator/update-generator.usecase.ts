import { NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { Generator } from "../../../domain/entities/generator.entity";
import { IGeneratorRepository } from "../../../domain/repositories/generator.repository";
import { IEventProducer } from "../../../domain/services/event-producer.service";
import { IPasswordCryptography } from "../../../domain/services/password-cryptography.service";
import { IValidator } from "../../../domain/services/validator.service";
import { Address } from "../../../domain/value-objects/address.value-object";
import { Password } from "../../../domain/value-objects/password.value-object";
import { TGeneratorInputDTO } from "../../dto/input/generator.dto.input";
import { TGeneratorOutputDTO } from "../../dto/output/generator.dto.output";
import { generatorFactory } from "../../factories/generator.factory";
import { mapGeneratorOutput } from "./map";

export class UpdateGeneratorUsecase {
  constructor(
    private readonly generatorRepository: IGeneratorRepository,
    private readonly passwordCryptography: IPasswordCryptography,
    private readonly validator: IValidator<TGeneratorInputDTO>,
    private readonly schema: object,
    private readonly eventProducer?: IEventProducer
  ) { }

  async execute(id: string, input: TGeneratorInputDTO): Promise<TGeneratorOutputDTO> {
    const { isValid, errorsResult } = this.validator.validate(this.schema, input)
    if (!isValid) throw new UnprocessableEntityException(errorsResult);

    const currentGenerator = await this.generatorRepository.findById(id)
    if (!currentGenerator) throw new NotFoundException("GENERATOR_NOT_FOUND")

    const generator = generatorFactory(input)
    if (!generator.isRight()) throw new UnprocessableEntityException(generator.value.getErrorValue())

    const hashedPassword = await this.passwordCryptography.hash(input.password)
    const password = Password.create({ password: hashedPassword }).getValue()
    const generatorValue = generator.value.getValue()
    generatorValue.setId(id)
    generatorValue.getUser().setPassword(password)

    const addressChanged = this.hasAddressChanged(currentGenerator, generatorValue)
    const result = await this.generatorRepository.update(generatorValue)
    const output = mapGeneratorOutput(result);

    try {
      if (addressChanged && this.eventProducer) {
        const event = this.mapToSyncAddressEvent(result.getAddress()[0]);
        await this.eventProducer.publish(process.env.KAFKA_ADDRESSES_TOPIC || 'addresses-sync', event);
      }
    } catch (err) {
      console.error('Failed to publish addresses updated event', err);
    }

    return output;
  }

  private hasAddressChanged(current: Generator, next: Generator): boolean {
    const currentAddress = current.getAddress()[0]
    const nextAddress = next.getAddress()[0]

    if (!currentAddress) return true

    return currentAddress.getZipCode() !== nextAddress.getZipCode()
      || currentAddress.getNumber() !== nextAddress.getNumber()
      || (currentAddress.getComplement() || '') !== (nextAddress.getComplement() || '')
  }

  private mapToSyncAddressEvent(address: Address) {
    return {
      id: address.getId(),
      zipCode: address.getZipCode(),
      number: address.getNumber(),
      complement: address.getComplement()
    };
  }
}
