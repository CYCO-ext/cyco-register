import { Generator } from "../entities/generator.entity";
import { Address } from "../value-objects/address.value-object";

export interface IGeneratorRepository {
  create(generator: Generator): Promise<Generator>
  findById(id: string): Promise<Generator>
  addAddress(address: Address, generator: Generator): Promise<Generator>
}
