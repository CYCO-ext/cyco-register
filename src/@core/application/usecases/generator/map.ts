import { Generator } from "../../../domain/entities/generator.entity";
import { TGeneratorOutputDTO } from "../../dto/output/generator.dto.output";

export const mapGeneratorOutput = (generator: Generator): TGeneratorOutputDTO => {
  return {
    id: generator.getId(),
    birthDate: generator.getBirthDate(),
    document: generator.getDocument(),
    email: generator.getUser().getEmail(),
    name: generator.getUser().getName(),
    phone: {
      ddd: generator.getUser().getPhone().getDdd(),
      ddi: generator.getUser().getPhone().getDdi(),
      number: generator.getUser().getPhone().getNumber()
    },
    address: generator.getAddress().map(item => ({
      zipCode: item.getZipCode(),
      number: item.getNumber(),
      complement: item.getComplement()
    }))
  }
}
