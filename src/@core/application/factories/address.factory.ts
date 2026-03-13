import { left } from "../../domain/shared/result/left.result";
import { Response } from "../../domain/shared/result/response.result";
import { right } from "../../domain/shared/result/right.result";
import { Address } from "../../domain/value-objects/address.value-object";
import { TAddressInputDTO } from "../dto/input/address.dto.input";

export const addressFactory = (input: TAddressInputDTO): Response<Address> => {
  const address = Address.create({
    complement: input.complement,
    number: input.number,
    zipCode: input.zipCode
  })

  if (address.isFailure) return left(address);
  return right(address)
}
