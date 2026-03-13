import { PrismaClient } from "@prisma/client"
import { IWasteCollectorRepository } from "../../../../@core/domain/repositories/waste-collector.repository"
import { WasteCollector } from "../../../../@core/domain/entities/waste-collector.entity"
import { TWasteCollectorPismaResult } from "./types/waste-collector.prisma";
import { Password } from "../../../../@core/domain/value-objects/password.value-object";
import { Phone } from "../../../../@core/domain/value-objects/phone.value-object";
import { User } from "../../../../@core/domain/entities/user.entity";
import { Address } from "../../../../@core/domain/value-objects/address.value-object";
import { Material } from "../../../../@core/domain/value-objects/material.value-object";
import { Enterprise } from "../../../../@core/domain/entities/enterprise.entity";

export class WasteCollectorRepositoryImpl implements IWasteCollectorRepository {
  constructor(private readonly prisma: PrismaClient) { }

  /**
   * Creates a new waste collector in the database.
   * @param wasteCollector - The WasteCollector entity to be created.
   * @returns A promise that resolves to the created WasteCollector.
   */
  async create(wasteCollector: WasteCollector): Promise<WasteCollector> {
    const result = await this.prisma.tbl_waste_collector.create({
      data: {
        document: wasteCollector.getDocument(),
        isEnterprise: wasteCollector.isEnterprise(),
        user: {
          create: {
            name: wasteCollector.getUser().getName(),
            phone: wasteCollector.getUser().getPhone().getPhone(),
            email: wasteCollector.getUser().getEmail(),
            password: wasteCollector.getUser().getPassword().getPassword()
          }
        },
        tbl_waste_collector_address: {
          create: {
            address: {
              connectOrCreate: {
                where: {
                  zipCode: wasteCollector.getAddress().getZipCode()
                },
                create: {
                  zipCode: wasteCollector.getAddress().getZipCode()
                }
              }
            },
            complement: wasteCollector.getAddress().getComplement(),
            number: wasteCollector.getAddress().getNumber()
          }
        },
        tbl_enterprise: wasteCollector.isEnterprise() ? {
          create: {
            commercialName: wasteCollector.getEnterprise().getCommercialName(),
            companyName: wasteCollector.getEnterprise().getCompanyName()
          }
        } : {},
        tbl_materials_waste_collector: {
          create: wasteCollector.getMaterials().map(material => ({
            materials: {
              connect: { name: material.getName() }
            }
          }))
        }
      },
      include: {
        user: true,
        tbl_waste_collector_address: {
          include: {
            address: true
          }
        },
        tbl_enterprise: true,
        tbl_materials_waste_collector: {
          select: {
            materials: true
          }
        }
      }
    });
    return result ? this.mapOutput(result) : null;
  }

  /**
   * Finds a waste collector by its ID.
   * @param id - The ID of the waste collector to find.
   * @returns A promise that resolves to the found WasteCollector or null if not found.
   */
  async findById(id: string): Promise<WasteCollector> {
    const result = await this.prisma.tbl_waste_collector.findUnique({
      where: { id },
      include: {
        user: true,
        tbl_waste_collector_address: {
          include: {
            address: true
          }
        },
        tbl_enterprise: true,
        tbl_materials_waste_collector: {
          select: {
            materials: true
          }
        }
      }
    });
    return result ? this.mapOutput(result) : null;
  }

  update(wasteCollector: WasteCollector): Promise<WasteCollector> {
    throw new Error("Method not implemented.")
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }

  /**
   * Finds all waste collectors.
   * @returns A promise that resolves to an array of WasteCollector or null if none found.
   */
  async findAll(): Promise<WasteCollector[]> {
    const result = await this.prisma.tbl_waste_collector.findMany({
      include: {
        user: true,
        tbl_waste_collector_address: {
          include: {
            address: true
          }
        },
        tbl_enterprise: true,
        tbl_materials_waste_collector: {
          select: {
            materials: true
          }
        }
      }
    });
    return result ? result.map(this.mapOutput) : null;
  }

  private mapOutput(result: TWasteCollectorPismaResult): WasteCollector {
    const password = Password.create({ password: result.user.password }).getValue()

    const phone = Phone.createFromString(result.user.phone).getValue()

    const user = User.create({
      name: result.user.name,
      phone: phone,
      email: result.user.email,
      password: password
    }).getValue()
    user.setId(result.user_id)

    const address = Address.create({
      zipCode: result.tbl_waste_collector_address[0].address.zipCode,
      number: result.tbl_waste_collector_address[0]?.number,
      complement: result.tbl_waste_collector_address[0]?.complement
    }).getValue()

    const wasteCollector = WasteCollector.create({
      isEnterprise: result.isEnterprise,
      materials: result.tbl_materials_waste_collector.map(item => Material.create({ name: item.materials.name }).getValue()),
      enterprise: result.isEnterprise ? Enterprise.create({
        commercialName: result.tbl_enterprise[0].commercialName,
        companyName: result.tbl_enterprise[0].companyName
      }).getValue() : null,
      document: result.document,
      user: user,
      address: address
    }).getValue();
    wasteCollector.setId(result.id);

    return wasteCollector;
  }
}
