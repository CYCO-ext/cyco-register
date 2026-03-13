import { Vehicle } from "../../../domain/entities/vehicle.entity";
import { TVehicleDtoOutput } from "../../dto/output/vehicle.dto.output";

export const mapVehiclesOutput = (vehicle: Vehicle): TVehicleDtoOutput => {
  return {
    id: vehicle.getId(),
    brand: vehicle.getBrand(),
    color: vehicle.getColor(),
    model: vehicle.getModel(),
    plate: vehicle.getPlate(),
    type: vehicle.getType(),
    year: vehicle.getYear()
  }
}
