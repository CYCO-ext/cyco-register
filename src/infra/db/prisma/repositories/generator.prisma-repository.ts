import { Injectable } from "@nestjs/common";
import { Generator } from "../../../../@core/domain/entities/generator.entity";
import { IGeneratorRepository } from "../../../../@core/domain/repositories/generator.repository";
import { PrismaClient } from "@prisma/client";
import { TGeneratorPrismaResult } from "./types/generator-prisma-types";
import { Password } from "../../../../@core/domain/value-objects/password.value-object";
import { Phone } from "../../../../@core/domain/value-objects/phone.value-object";
import { User } from "../../../../@core/domain/entities/user.entity";
import { Address } from "../../../../@core/domain/value-objects/address.value-object";

export class GeneratorRepositoryImpl implements IGeneratorRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async addAddress(address: Address, generator: Generator): Promise<Generator> {
    const result = await this.prisma.tbl_generator_address.create({
      data: {
        complement: address.getComplement(),
        number: address.getNumber(),
        generator: {
          connect: {
            id: generator.getId()
          }
        },
        address: {
          connectOrCreate: {
            where: {
              zipCode: address.getZipCode()
            },
            create: {
              zipCode: address.getZipCode()
            }
          }
        }
      },
      include: {
        generator: {
          include: {
            user: true,
            tbl_generator_address: {
              include: {
                address: true
              }
            }
          }
        }
      }
    })

    return this.mapOutput(result.generator)
  }

  async findById(id: string): Promise<Generator> {
    const result = await this.prisma.tbl_generator.findUnique({
      where: { id },
      include: {
        user: true,
        tbl_generator_address: {
          include: {
            address: true
          }
        }
      }
    })

    return result ? this.mapOutput(result) : null
  }

  async create(generator: Generator): Promise<Generator> {
    const result = await this.prisma.tbl_generator.create({
      data: {
        user: {
          create: {
            email: generator.getUser().getEmail(),
            password: generator.getUser().getPassword().getPassword(),
            phone: generator.getUser().getPhone().getPhone(),
            name: generator.getUser().getName()
          }
        },
        birthDate: generator.getBirthDate(),
        document: generator.getDocument()
      },
      include: {
        user: true,
        tbl_generator_address: {
          include: {
            address: true
          }
        }
      }
    })

    return this.mapOutput(result)
  }

  private mapOutput(result: TGeneratorPrismaResult): Generator {
    const password = Password.create({ password: result.user.password }).getValue()

    const phone = Phone.createFromString(result.user.phone).getValue()

    const user = User.create({
      name: result.user.name,
      phone: phone,
      email: result.user.email,
      password: password
    }).getValue()
    user.setId(result.user_id)

    const address = result.tbl_generator_address.map(it => Address.create({
      zipCode: it.address.zipCode,
      complement: it.complement,
      number: it.number
    }).getValue())

    const generator = Generator.create({
      birthDate: result.birthDate,
      document: result.document,
      user,
      address
    }).getValue()
    generator.setId(result.id);

    return generator
  }
}
