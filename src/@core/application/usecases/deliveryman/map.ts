import { Deliveryman } from "../../../domain/entities/deliveryman.entity";
import { TDeliverymanOutputDTO } from "../../dto/output/deliveryman.dto.output";

export const mapDeliverymanOutput = (deliveryman: Deliveryman): TDeliverymanOutputDTO => {
  return {
    id: deliveryman.getId(),
    birthDate: deliveryman.getBirthDate(),
    licenseNumber: deliveryman.getLicenseNumber(),
    email: deliveryman.getUser().getEmail(),
    name: deliveryman.getUser().getName(),
    phone: {
      ddd: deliveryman.getUser().getPhone().getDdd(),
      ddi: deliveryman.getUser().getPhone().getDdi(),
      number: deliveryman.getUser().getPhone().getNumber()
    },
    vehicle: {
      id: deliveryman.getVehicle().getId(),
      brand: deliveryman.getVehicle().getBrand(),
      color: deliveryman.getVehicle().getColor(),
      model: deliveryman.getVehicle().getModel(),
      plate: deliveryman.getVehicle().getPlate(),
      type: deliveryman.getVehicle().getType(),
      year: deliveryman.getVehicle().getYear()
    }
  }
}
