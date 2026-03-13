import { PrismaClient } from "@prisma/client";
import { IMaterialRepository } from "../../../../@core/domain/repositories/material.repository";
import { Material } from "../../../../@core/domain/value-objects/material.value-object";

export class MaterialRepositoryImpl implements IMaterialRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async findAll() {
    const result = await this.prisma.tbl_materials.findMany();
    return result.length === 0 ? null : result.map(item => this.mapOutput(item));
  }

  async findByName(name: string) {
    const result = await this.prisma.tbl_materials.findUnique({
      where: { name },
    });
    return result ? this.mapOutput(result) : null;
  }

  async create(data: { name: string }) {
    return await this.prisma.tbl_materials.create({
      data,
    });
  }

  async update(name: string, data: { name?: string }) {
    return await this.prisma.tbl_materials.update({
      where: { name },
      data,
    });
  }

  async delete(name: string) {
    return await this.prisma.tbl_materials.delete({
      where: { name },
    });
  }

  private mapOutput(material: { name: string }): Material {
    return Material.create({ name: material.name }).getValue();
  }
}
