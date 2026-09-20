import { BadRequestException } from '@nestjs/common';
import { IDeliverymanRepository } from '../../../domain/repositories/deliveryman.repository';
import { TDeliverymanOutputDTO } from '../../dto/output/deliveryman.dto.output';
import { mapDeliverymanOutput } from './map';

export class ListDeliverymenByCollectorUsecase {
  constructor(private readonly deliverymanRepository: IDeliverymanRepository) {}

  async execute(wasteCollectorId: string): Promise<TDeliverymanOutputDTO[]> {
    if (!wasteCollectorId) {
      throw new BadRequestException('WASTE_COLLECTOR_ID_REQUIRED');
    }

    const deliverymen = await this.deliverymanRepository.findByWasteCollectorId(
      wasteCollectorId,
    );
    return deliverymen.map(mapDeliverymanOutput);
  }
}
