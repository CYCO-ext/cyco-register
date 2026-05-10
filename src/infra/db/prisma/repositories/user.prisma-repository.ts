import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../../../@core/domain/repositories/user-repository.repository";
import { User } from "../../../../@core/domain/entities/user.entity";
import { TUserPrismaResult } from "./types/user-prisma-types";
import { Password } from "../../../../@core/domain/value-objects/password.value-object";
import { Phone } from "../../../../@core/domain/value-objects/phone.value-object";

export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async findByEmail(email: string): Promise<User> {
    const result = await this.prisma.tbl_user.findUnique({
      where: {
        email,
      },
      include: {
        tbl_generator: true,
        tbl_waste_collector: true
      }
    })

    return result ? this.mapOutput(result) : null;
  }

  async getRoleByEmail(email: string): Promise<"WASTE_COLLECTOR" | "GENERATOR"> {
    const result = await this.prisma.tbl_user.findUnique({
      where: {
        email,
      },
      include: {
        tbl_generator: true,
        tbl_waste_collector: true
      }
    })

    if (result.tbl_generator.length > 0) return "GENERATOR"
    if (result.tbl_waste_collector.length > 0) return "WASTE_COLLECTOR"
    return null
  }

  private mapOutput(result: TUserPrismaResult): User {
    const user = User.create({
      email: result.email,
      name: result.name,
      password: Password.create({ password: result.password }).getValue(),
      phone: Phone.createFromString(result.phone).getValue()
    }).getValue();

    user.setId(result.tbl_generator.length > 0 ? result.tbl_generator[0].id : result.tbl_waste_collector[0].id)
    return user
  }
}
