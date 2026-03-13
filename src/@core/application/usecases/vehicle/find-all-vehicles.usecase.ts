import { NotFoundException } from "@nestjs/common";
import { IVehicleRepository } from "../../../domain/repositories/vehicle.repository";
import { TVehicleDtoOutput } from "../../dto/output/vehicle.dto.output";
import { mapVehiclesOutput } from "./map";

export class FindAllVehiclesUsecase {
  constructor(
    private readonly vehicleRepository: IVehicleRepository
  ) { }

  async execute(): Promise<TVehicleDtoOutput[]> {
    const vehicles = await this.vehicleRepository.findAll();
    if (!vehicles) throw new NotFoundException("NOT_FOUND_VEHICLE")

    return vehicles.map(item => mapVehiclesOutput(item))
  }
}
