import { Material } from "../../../domain/value-objects/material.value-object";
import { TMaterialOutputDTO } from "../../dto/output/material.dto.output";

export const mapMaterialsOutput = (material: Material): TMaterialOutputDTO => {
  return {
    name: material.getName()
  };
}
