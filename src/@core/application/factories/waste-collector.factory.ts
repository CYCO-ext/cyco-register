import { WasteCollector } from "../../domain/entities/waste-collector.entity";
import { left } from "../../domain/shared/result/left.result";
import { right } from "../../domain/shared/result/right.result";
import { Address } from "../../domain/value-objects/address.value-object";
import { Material } from "../../domain/value-objects/material.value-object";
import { TWasteCollectorInputDTO } from "../dto/input/waste-collector.dto.input";
import { userFactory } from "./user.factory";
import { Response } from "../../domain/shared/result/response.result";
import { Enterprise } from "../../domain/entities/enterprise.entity";


export const wasteCollectorFactory = (wasteCollector: TWasteCollectorInputDTO): Response<WasteCollector> => {
  const address = Address.create(wasteCollector.address)
  if (address.isFailure) return left(address);

  const user = userFactory({
    email: wasteCollector.email,
    name: wasteCollector.name,
    password: wasteCollector.password,
    phone: wasteCollector.phone
  });
  if (!user.isRight()) return left(user.value)

  const materials = wasteCollector.materials.map(material => {
    return Material.create({
      name: material
    })
  })

  if (materials.some(material => material.isFailure)) {
    return left(materials.find(material => material.isFailure));
  }

  let enterprise = null;
  if (wasteCollector.isEnterprise) {
    enterprise = Enterprise.create({
      commercialName: wasteCollector.name,
      companyName: wasteCollector.enterprise.companyName,
    })
    if (enterprise.isFailure) return left(enterprise);
  }

  const entity = WasteCollector.create({
    address: address.getValue(),
    user: user.value.getValue(),
    document: wasteCollector.document,
    isEnterprise: wasteCollector.isEnterprise,
    materials: materials.map(material => material.getValue()),
    enterprise: enterprise ? enterprise.getValue() : null
  })
  if (entity.isFailure) return left(entity);
  return right(entity);
}
