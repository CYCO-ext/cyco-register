import { NotFoundException } from "@nestjs/common";
import { IWasteCollectorRepository } from "../../../domain/repositories/waste-collector.repository";
import { TWasteCollectorOutputDTO } from "../../dto/output/waste-collector.dto.output";
import { mapWasteCollectorOutput } from "./map";

export class FindAllWasteCollectorsUsecase {
  constructor(
    private readonly wasteCollectorRepository: IWasteCollectorRepository
  ) { }

  public async execute(): Promise<TWasteCollectorOutputDTO[]> {
    const result = await this.wasteCollectorRepository.findAll()
    if (!result) throw new NotFoundException("WASTE_COLLECTOR_NOT_FOUND")

    return result.map(mapWasteCollectorOutput);
  }
}
