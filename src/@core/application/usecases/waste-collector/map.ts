import { WasteCollector } from "../../../domain/entities/waste-collector.entity"
import { TWasteCollectorOutputDTO } from "../../dto/output/waste-collector.dto.output"

export const mapWasteCollectorOutput = (wasteCollector: WasteCollector): TWasteCollectorOutputDTO => {
  return {
    id: wasteCollector.getId(),
    address: {
      complement: wasteCollector.getAddress().getComplement(),
      number: wasteCollector.getAddress().getNumber(),
      zipCode: wasteCollector.getAddress().getZipCode()
    },
    enterprise: wasteCollector.isEnterprise() ? {
      commercialName: wasteCollector.getEnterprise().getCommercialName(),
      companyName: wasteCollector.getEnterprise().getCompanyName(),
    } : null,
    document: wasteCollector.getDocument(),
    email: wasteCollector.getUser().getEmail(),
    phone: {
      ddd: wasteCollector.getUser().getPhone().getDdd(),
      ddi: wasteCollector.getUser().getPhone().getDdi(),
      number: wasteCollector.getUser().getPhone().getNumber()
    },
    isEnterprise: wasteCollector.isEnterprise(),
    materials: wasteCollector.getMaterials().map(material => material.getName()),
  }
}
