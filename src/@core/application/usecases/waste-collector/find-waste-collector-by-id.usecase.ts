import { NotFoundException } from "@nestjs/common";
import { IWasteCollectorRepository } from "src/@core/domain/repositories/waste-collector.repository";
import { mapWasteCollectorOutput } from "./map";
import { TWasteCollectorOutputDTO } from "../../dto/output/waste-collector.dto.output";

export class FindWasteCollectorByIdUsecase {
  constructor(
    private readonly wasteCollectorRepository: IWasteCollectorRepository
  ) { }

  public async execute(id: string): Promise<TWasteCollectorOutputDTO> {
    const result = await this.wasteCollectorRepository.findById(id)
    if (!result) throw new NotFoundException("WASTE_COLLECTOR_NOT_FOUND")

    return mapWasteCollectorOutput(result);
  }
}
