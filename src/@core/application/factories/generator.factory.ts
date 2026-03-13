import { Generator } from "../../domain/entities/generator.entity";
import { left } from "../../domain/shared/result/left.result";
import { Response } from "../../domain/shared/result/response.result";
import { right } from "../../domain/shared/result/right.result";
import { TGeneratorInputDTO } from "../dto/input/generator.dto.input";
import { userFactory } from "./user.factory";

export const generatorFactory = (generator: TGeneratorInputDTO): Response<Generator> => {
  const user = userFactory({
    email: generator.email,
    name: generator.name,
    password: generator.password,
    phone: generator.phone
  })

  if (!user.isRight()) return left(user.value)

  const generatorEntity = Generator.create({
    birthDate: generator.birthDate,
    document: generator.document,
    user: user.value.getValue(),
    address: []
  })

  if (generatorEntity.isFailure) return left(generatorEntity)
  return right(generatorEntity)
}
