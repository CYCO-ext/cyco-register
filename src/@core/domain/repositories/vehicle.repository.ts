import { Vehicle } from "../entities/vehicle.entity";

export interface IVehicleRepository {
  findByIdModelAndColor(id: string, modelId: string, colorId: string): Promise<Vehicle>
  findAll(): Promise<Vehicle[]>;
}
