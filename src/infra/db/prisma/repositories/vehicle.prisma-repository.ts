import { PrismaClient } from "@prisma/client";
import { Vehicle } from "../../../../@core/domain/entities/vehicle.entity";
import { IVehicleRepository } from "../../../../@core/domain/repositories/vehicle.repository";
import { TVehiclePrismaResult } from "./types/vehicle-prisma-types";

export class VehicleRepositoryImpl implements IVehicleRepository {
  constructor(
    private readonly prisma: PrismaClient
  ) { }

  async findAll(): Promise<Vehicle[]> {
    const result = await this.prisma.tbl_vehicle.findMany({
      include: {
        brand: true,
        tbl_vehicle_color: { select: { color: true } },
        tbl_vehicle_vehicle_model: { select: { model: true } },
        type: true,
        tbl_vehicle_deliveryman: true
      }
    })

    return result.length == 0 ? null : result.map(item => this.mapOutputWithMultipleColors(item))
  }

  async findByIdModelAndColor(id: string, modelId: string, colorId: string): Promise<Vehicle> {
    const result = await this.prisma.tbl_vehicle.findUnique({
      where: {
        id,
        tbl_vehicle_color: {
          some: { color_id: colorId }
        },
        tbl_vehicle_vehicle_model: {
          some: { model_id: modelId }
        }
      },
      include: {
        brand: true,
        tbl_vehicle_color: { select: { color: true } },
        tbl_vehicle_vehicle_model: { select: { model: true } },
        type: true,
        tbl_vehicle_deliveryman: true
      }
    })

    return result ? this.mapOutput(result, modelId, colorId) : null;
  }

  private mapOutputWithMultipleColors(result: TVehiclePrismaResult): Vehicle {
    const color = result.tbl_vehicle_color[0].color;
    const model = result.tbl_vehicle_vehicle_model[0].model;
    const vehicle = Vehicle.create({
      brand: result.brand.brand,
      color: color.color,
      colorId: color.id,
      model: model.model,
      modelId: model.id,
      plate: result.tbl_vehicle_deliveryman[0]?.plate ?? "000000",
      type: result.type.type,
      year: result.year
    }).getValue()
    vehicle.setId(result.id)
    return vehicle
  }

  private mapOutput(result: TVehiclePrismaResult, modelId: string, colorId: string): Vehicle {
    const color = result.tbl_vehicle_color.filter(it => it.color.id === colorId)[0].color;
    const model = result.tbl_vehicle_vehicle_model.filter(it => it.model.id === modelId)[0].model;
    const vehicle = Vehicle.create({
      brand: result.brand.brand,
      color: color.color,
      colorId: color.id,
      model: model.model,
      modelId: model.id,
      plate: result.tbl_vehicle_deliveryman[0]?.plate ?? "000000",
      type: result.type.type,
      year: result.year
    }).getValue()
    vehicle.setId(result.id)
    return vehicle
  }
}
