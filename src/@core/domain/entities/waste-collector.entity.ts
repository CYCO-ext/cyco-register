import { Guard } from "../shared/guard/guard";
import { Result } from "../shared/result/result";
import { Address } from "../value-objects/address.value-object";
import { Material } from "../value-objects/material.value-object";
import { Enterprise } from "./enterprise.entity";
import { User } from "./user.entity";

export type TWasteCollectorProps = {
  user: User;
  document: string;
  address: Address;
  materials: Material[];
  isEnterprise: boolean;
  enterprise?: Enterprise;
}

export class WasteCollector {
  private id: string;
  private props: TWasteCollectorProps;

  private constructor(props: TWasteCollectorProps) {
    this.props = props;
  }

  public static create(props: TWasteCollectorProps): Result<WasteCollector> {
    const guardResults = Guard.combine([
      Guard.againstNullOrUndefined(props.user, 'user'),
      Guard.againstNullOrUndefined(props.document, 'document'),
      Guard.againstNullOrUndefined(props.address, 'address'),
      Guard.againstNullOrUndefined(props.materials, 'materials'),
      Guard.againstNullOrUndefined(props.isEnterprise, 'isEnterprise')
    ]);

    if (guardResults.isFailure) {
      return Result.fail(guardResults.getErrorValue());
    }

    return Result.ok(new WasteCollector(props));
  }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getUser(): User {
    return this.props.user;
  }

  public setUser(user: User): void {
    this.props.user = user;
  }

  public getDocument(): string {
    return this.props.document;
  }

  public setDocument(document: string): void {
    this.props.document = document;
  }

  public getAddress(): Address {
    return this.props.address;
  }

  public setAddress(address: Address): void {
    this.props.address = address;
  }

  public getMaterials(): Material[] {
    return this.props.materials;
  }

  public setMaterials(materials: Material[]): void {
    this.props.materials = materials;
  }

  public isEnterprise(): boolean {
    return this.props.isEnterprise;
  }

  public setIsEnterprise(isEnterprise: boolean): void {
    this.props.isEnterprise = isEnterprise;
  }

  public getEnterprise(): Enterprise | undefined {
    return this.props.enterprise;
  }

  public setEnterprise(enterprise: Enterprise): void {
    this.props.enterprise = enterprise;
  }
}
