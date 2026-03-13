import { NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { IPasswordCryptography } from "../../../domain/services/password-cryptography.service";
import { IValidator } from "../../../domain/services/validator.service";
import { Password } from "../../../domain/value-objects/password.value-object";
import { IDeliverymanRepository } from "../../../domain/repositories/deliveryman.repository";
import { TDeliverymanInputDTO } from "../../dto/input/deliveryman.dto.input";
import { TDeliverymanOutputDTO } from "../../dto/output/deliveryman.dto.output";
import { deliverymanFactory } from "../../factories/deliveryman.factory";
import { mapDeliverymanOutput } from "./map";
import { IVehicleRepository } from "../../../domain/repositories/vehicle.repository";

export class CreateDeliverymanUsecase {
  constructor(
    private readonly deliverymanRepository: IDeliverymanRepository,
    private readonly vehicleRepository: IVehicleRepository,
    private readonly passwordCryptography: IPasswordCryptography,
    private readonly validator: IValidator<TDeliverymanInputDTO>,
    private readonly schema: object
  ) { }

  async execute(input: TDeliverymanInputDTO): Promise<TDeliverymanOutputDTO> {
    const { isValid, errorsResult } = this.validator.validate(this.schema, input)
    if (!isValid) throw new UnprocessableEntityException(errorsResult);

    const vehicleExists = await this.vehicleRepository.findByIdModelAndColor(input.vehicle.id, input.vehicle.modelId, input.vehicle.colorId)
    if (!vehicleExists) throw new NotFoundException("VEHICLE_NOT_FOUND")
    vehicleExists.setPlate(input.vehicle.plate)

    const deliveryman = deliverymanFactory(input, vehicleExists)
    if (!deliveryman.isRight()) throw new UnprocessableEntityException(deliveryman.value.getErrorValue())

    const hashedPassword = await this.passwordCryptography.hash(input.password)
    const password = Password.create({ password: hashedPassword }).getValue()
    const deliverymanValue = deliveryman.value.getValue()
    deliverymanValue.getUser().setPassword(password)

    const result = await this.deliverymanRepository.create(deliverymanValue)
    return mapDeliverymanOutput(result);
  }
}
