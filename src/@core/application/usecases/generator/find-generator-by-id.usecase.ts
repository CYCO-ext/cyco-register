import { NotFoundException } from "@nestjs/common";
import { IGeneratorRepository } from "../../../domain/repositories/generator.repository";
import { TGeneratorOutputDTO } from "../../dto/output/generator.dto.output";
import { mapGeneratorOutput } from "./map";

export class FindGeneratorByIdUsecase {
  constructor(
    private readonly generatorRepository: IGeneratorRepository
  ) { }

  public async execute(id: string): Promise<TGeneratorOutputDTO> {
    const result = await this.generatorRepository.findById(id)
    if (!result) throw new NotFoundException("GENERATOR_NOT_FOUND")

    return mapGeneratorOutput(result);
  }
}
