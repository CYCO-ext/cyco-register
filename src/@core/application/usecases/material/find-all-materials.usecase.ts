import { NotFoundException } from "@nestjs/common";
import { IMaterialRepository } from "../../../domain/repositories/material.repository";
import { TMaterialOutputDTO } from "../../dto/output/material.dto.output";
import { mapMaterialsOutput } from "./map";

export class FindAllMaterialsUsecase {
  constructor(
    private readonly materialRepository: IMaterialRepository
  ) { }

  async execute(): Promise<TMaterialOutputDTO[]> {
    const material = await this.materialRepository.findAll();
    if (!material) throw new NotFoundException("NOT_FOUND_MATERIAL")

    return material.map(item => mapMaterialsOutput(item))
  }
}
