import { UnprocessableEntityException } from "@nestjs/common";
import { IGeneratorRepository } from "../../../domain/repositories/generator.repository";
import { IPasswordCryptography } from "../../../domain/services/password-cryptography.service";
import { IValidator } from "../../../domain/services/validator.service";
import { TGeneratorInputDTO } from "../../dto/input/generator.dto.input";
import { TGeneratorOutputDTO } from "../../dto/output/generator.dto.output";
import { generatorFactory } from "../../factories/generator.factory";
import { Password } from "../../../domain/value-objects/password.value-object";
import { mapGeneratorOutput } from "./map";

export class CreateGeneratorUsecase {
  constructor(
    private readonly generatorRepository: IGeneratorRepository,
    private readonly passwordCryptography: IPasswordCryptography,
    private readonly validator: IValidator<TGeneratorInputDTO>,
    private readonly schema: object
  ) { }

  async execute(input: TGeneratorInputDTO): Promise<TGeneratorOutputDTO> {
    const { isValid, errorsResult } = this.validator.validate(this.schema, input)
    if (!isValid) throw new UnprocessableEntityException(errorsResult);

    const generator = generatorFactory(input)
    if (!generator.isRight()) throw new UnprocessableEntityException(generator.value.getErrorValue())

    const hashedPassword = await this.passwordCryptography.hash(input.password)
    const password = Password.create({ password: hashedPassword }).getValue()
    const generatorValue = generator.value.getValue()
    generatorValue.getUser().setPassword(password)

    const result = await this.generatorRepository.create(generatorValue)
    return mapGeneratorOutput(result);
  }
}
