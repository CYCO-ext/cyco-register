import { Generator } from "../../domain/entities/generator.entity";
import { left } from "../../domain/shared/result/left.result";
import { Response } from "../../domain/shared/result/response.result";
import { right } from "../../domain/shared/result/right.result";
import { TGeneratorInputDTO } from "../dto/input/generator.dto.input";
import { addressFactory } from "./address.factory";
import { userFactory } from "./user.factory";

export const generatorFactory = (generator: TGeneratorInputDTO): Response<Generator> => {
  const user = userFactory({
    email: generator.email,
    name: generator.name,
    password: generator.password,
    phone: generator.phone
  })

  if (!user.isRight()) return left(user.value)

  const address = addressFactory({
    zipCode: generator.address.zipCode,
    number: generator.address.number,
    complement: generator.address.complement
  })

  if (!address.isRight()) return left(address.value)

  const generatorEntity = Generator.create({
    birthDate: generator.birthDate,
    document: generator.document,
    user: user.value.getValue(),
    address: [address.value.getValue()]
  })

  if (generatorEntity.isFailure) return left(generatorEntity)
  return right(generatorEntity)
}
