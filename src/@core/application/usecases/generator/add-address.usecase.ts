import { NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { IGeneratorRepository } from "../../../domain/repositories/generator.repository";
import { IValidator } from "../../../domain/services/validator.service";
import { TAddressInputDTO } from "../../dto/input/address.dto.input";
import { TGeneratorOutputDTO } from "../../dto/output/generator.dto.output";
import { addressFactory } from "../../factories/address.factory";
import { mapGeneratorOutput } from "./map";

export class AddAddressUsecase {
  constructor(
    private readonly generatorRepository: IGeneratorRepository,
    private readonly validator: IValidator<TAddressInputDTO>,
    private readonly schema: object
  ) { }

  async execute(input: TAddressInputDTO, id: string): Promise<TGeneratorOutputDTO> {
    const { isValid, errorsResult } = this.validator.validate(this.schema, input)
    if (!isValid) throw new UnprocessableEntityException(errorsResult);

    const generator = await this.generatorRepository.findById(id)
    if (!generator) throw new NotFoundException("GENERATOR_NOT_FOUND")

    const address = addressFactory(input);
    if (!address.isRight()) throw new UnprocessableEntityException(address.value.getErrorValue())

    const result = await this.generatorRepository.addAddress(address.value.getValue(), generator)

    return mapGeneratorOutput(result)
  }
}
