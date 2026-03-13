import { NotFoundException } from "@nestjs/common";
import { IDeliverymanRepository } from "../../../domain/repositories/deliveryman.repository";
import { TDeliverymanOutputDTO } from "../../dto/output/deliveryman.dto.output";
import { mapDeliverymanOutput } from "./map";

export class FindDeliverymanByIdUsecase {
  constructor(
    private readonly deliverymanRepository: IDeliverymanRepository
  ) { }

  async execute(id: string): Promise<TDeliverymanOutputDTO> {
    const result = await this.deliverymanRepository.findById(id)
    if (!result) throw new NotFoundException("DELIVERYMAN_NOT_FOUND")
    return mapDeliverymanOutput(result)
  }
}
