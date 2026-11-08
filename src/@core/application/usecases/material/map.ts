import { Material } from "../../../domain/value-objects/material.value-object";
import { TMaterialOutputDTO } from "../../dto/output/material.dto.output";

export const mapMaterialsOutput = (material: Material): TMaterialOutputDTO => {
  return {
    id: material.getId() ?? material.getName(),
    name: material.getName()
  };
}
