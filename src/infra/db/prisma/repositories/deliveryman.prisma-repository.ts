import { PrismaClient } from '@prisma/client';
import { Deliveryman } from '../../../../@core/domain/entities/deliveryman.entity';
import { User } from '../../../../@core/domain/entities/user.entity';
import { Vehicle } from '../../../../@core/domain/entities/vehicle.entity';
import { IDeliverymanRepository } from '../../../../@core/domain/repositories/deliveryman.repository';
import { Password } from '../../../../@core/domain/value-objects/password.value-object';
import { Phone } from '../../../../@core/domain/value-objects/phone.value-object';
import { TDeliverymanPrismaResult } from './types/deliveryman-prisma-types';

export class DeliverymanRepositoryImpl implements IDeliverymanRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Deliveryman> {
    const result = await this.prisma.tbl_deliveryman.findUnique({
      where: { id },
      include: {
        user: true,
        tbl_vehicle_deliveryman: {
          include: {
            vehicle: {
              include: {
                brand: true,
                tbl_vehicle_color: { select: { color: true } },
                tbl_vehicle_vehicle_model: { select: { model: true } },
                type: true,
              },
            },
          },
        },
      },
    });

    return result
      ? this.mapOutput(
          result as unknown as TDeliverymanPrismaResult,
          result.tbl_vehicle_deliveryman[0].color_id,
          result.tbl_vehicle_deliveryman[0].model_id,
        )
      : null;
  }

  async create(deliveryman: Deliveryman): Promise<Deliveryman> {
    const [color, model] = await Promise.all([
      this.prisma.tbl_color.findUnique({
        where: { color: deliveryman.getVehicle().getColor() },
      }),
      this.prisma.tbl_vehicle_model.findUnique({
        where: { model: deliveryman.getVehicle().getModel() },
      }),
    ]);

    const result = await this.prisma.tbl_deliveryman.create({
      data: {
        birthDate: deliveryman.getBirthDate(),
        licenseNumber: deliveryman.getLicenseNumber(),
        waste_collector_id: deliveryman.getWasteCollectorId(),
        user: {
          create: {
            email: deliveryman.getUser().getEmail(),
            password: deliveryman.getUser().getPassword().getPassword(),
            phone: deliveryman.getUser().getPhone().getPhone(),
            name: deliveryman.getUser().getName(),
          },
        },
        tbl_vehicle_deliveryman: {
          create: {
            plate: deliveryman.getVehicle().getPlate(),
            vehicle_id: deliveryman.getVehicle().getId(),
            color_id: color.id,
            model_id: model.id,
          },
        },
      } as any,
      include: {
        user: true,
        tbl_vehicle_deliveryman: {
          include: {
            vehicle: {
              include: {
                brand: true,
                tbl_vehicle_color: { select: { color: true } },
                tbl_vehicle_vehicle_model: { select: { model: true } },
                type: true,
              },
            },
          },
        },
      },
    });

    return this.mapOutput(
      result as unknown as TDeliverymanPrismaResult,
      color.id,
      model.id,
    );
  }

  private mapOutput(
    result: TDeliverymanPrismaResult,
    colorId: string,
    modelId: string,
  ): Deliveryman {
    const assignedVehicle = result.tbl_vehicle_deliveryman[0];
    const color = assignedVehicle.vehicle.tbl_vehicle_color.filter(
      (it) => it.color.id === colorId,
    )[0].color.color;
    const model = assignedVehicle.vehicle.tbl_vehicle_vehicle_model.filter(
      (it) => it.model.id === modelId,
    )[0].model.model;

    const vehicle = Vehicle.create({
      brand: assignedVehicle.vehicle.brand.brand,
      color,
      model,
      plate: assignedVehicle.plate ?? '000000',
      type: assignedVehicle.vehicle.type.type,
      year: assignedVehicle.vehicle.year,
    }).getValue();
    vehicle.setId(result.id);

    const password = Password.create({
      password: result.user.password,
    }).getValue();
    const phone = Phone.createFromString(result.user.phone).getValue();
    const user = User.create({
      name: result.user.name,
      phone: phone,
      email: result.user.email,
      password: password,
    }).getValue();
    user.setId(result.user_id);
    const deliveryman = Deliveryman.create({
      birthDate: result.birthDate,
      licenseNumber: result.licenseNumber,
      wasteCollectorId: result.waste_collector_id,
      user,
      vehicle,
    }).getValue();
    deliveryman.setId(result.id);
    return deliveryman;
  }
}
