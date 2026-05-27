import { ConflictException, UnprocessableEntityException } from "@nestjs/common";
import { IGeneratorRepository } from "../../../domain/repositories/generator.repository";
import { IUserRepository } from "../../../domain/repositories/user-repository.repository";
import { IPasswordCryptography } from "../../../domain/services/password-cryptography.service";
import { IValidator } from "../../../domain/services/validator.service";
import { TGeneratorInputDTO } from "../../dto/input/generator.dto.input";
import { TGeneratorOutputDTO } from "../../dto/output/generator.dto.output";
import { generatorFactory } from "../../factories/generator.factory";
import { Password } from "../../../domain/value-objects/password.value-object";
import { mapGeneratorOutput } from "./map";
import { IEventProducer } from "../../../domain/services/event-producer.service";
import { Address } from "../../../domain/value-objects/address.value-object";

export class CreateGeneratorUsecase {
  constructor(
    private readonly generatorRepository: IGeneratorRepository,
    private readonly userRepository: IUserRepository,
    private readonly passwordCryptography: IPasswordCryptography,
    private readonly validator: IValidator<TGeneratorInputDTO>,
    private readonly schema: object,
    private readonly eventProducer?: IEventProducer
  ) { }

  async execute(input: TGeneratorInputDTO): Promise<TGeneratorOutputDTO> {
    const { isValid, errorsResult } = this.validator.validate(this.schema, input)
    if (!isValid) throw new UnprocessableEntityException(errorsResult);

    const userAlreadyExists = await this.userRepository.findByEmail(input.email);
    if (userAlreadyExists) throw new ConflictException('Email already exists');

    const generator = generatorFactory(input)
    if (!generator.isRight()) throw new UnprocessableEntityException(generator.value.getErrorValue())

    const hashedPassword = await this.passwordCryptography.hash(input.password)
    const password = Password.create({ password: hashedPassword }).getValue()
    const generatorValue = generator.value.getValue()
    generatorValue.getUser().setPassword(password)

    const result = await this.generatorRepository.create(generatorValue)
    const output = mapGeneratorOutput(result);

    console.log('Generator created with ID:', result.getId());

    try {
      if (this.eventProducer) {
        const event = this.mapToSyncAddressEvent(result.getAddress()[0]);
        await this.eventProducer.publish(process.env.KAFKA_ADDRESSES_TOPIC || 'addresses-sync', event);
      }
    } catch (err) {
      console.error('Failed to publish addresses created event', err);
    }

    console.log('Finished CreateGeneratorUsecase execution');

    return output;
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
