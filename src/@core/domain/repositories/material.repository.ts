import { Material } from "../value-objects/material.value-object";

export interface IMaterialRepository {
  findByName(name: string): Promise<Material | null>;
  findAll(): Promise<Material[]>;
}
