import { Deliveryman } from "../../domain/entities/deliveryman.entity";
import { Vehicle } from "../../domain/entities/vehicle.entity";
import { left } from "../../domain/shared/result/left.result";
import { Response } from "../../domain/shared/result/response.result";
import { right } from "../../domain/shared/result/right.result";
import { TDeliverymanInputDTO } from "../dto/input/deliveryman.dto.input";
import { userFactory } from "./user.factory";

export const deliverymanFactory = (deliveryman: TDeliverymanInputDTO, vehicle: Vehicle): Response<Deliveryman> => {
  const user = userFactory({
    email: deliveryman.email,
    name: deliveryman.name,
    password: deliveryman.password,
    phone: deliveryman.phone
  })

  if (!user.isRight()) return left(user.value)

  const deliverymanEntity = Deliveryman.create({
    birthDate: deliveryman.birthDate,
    licenseNumber: deliveryman.licenseNumber,
    vehicle,
    user: user.value.getValue()
  })

  if (deliverymanEntity.isFailure) return left(deliverymanEntity)
  return right(deliverymanEntity)
}
