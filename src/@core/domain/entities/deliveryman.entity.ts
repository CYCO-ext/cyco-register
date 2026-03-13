import { Guard } from "../shared/guard/guard";
import { Result } from "../shared/result/result";
import { User } from "./user.entity";
import { Vehicle } from "./vehicle.entity";

export type TDeliverymanProps = {
  licenseNumber: string;
  birthDate: Date;
  vehicle: Vehicle;
  user: User;
}

export class Deliveryman {
  private id: string;
  private props: TDeliverymanProps;

  private constructor(props: TDeliverymanProps) {
    this.props = props;
  }

  public static create(deliveryman: TDeliverymanProps) {
    const guardResults = Guard.combine([
      Guard.againstNullOrUndefined(deliveryman.licenseNumber, 'licenseNumber'),
      Guard.againstNullOrUndefined(deliveryman.birthDate, 'birthDate'),
      Guard.againstNullOrUndefined(deliveryman.vehicle, 'vehicle'),
      Guard.againstNullOrUndefined(deliveryman.user, 'user'),
    ])

    if (guardResults.isFailure) {
      return Result.fail<Deliveryman>(guardResults.getErrorValue());
    }

    return Result.ok<Deliveryman>(new Deliveryman(deliveryman));
  }

  public getId() {
    return this.id
  }

  public getLicenseNumber() {
    return this.props.licenseNumber
  }

  public getBirthDate() {
    return this.props.birthDate
  }

  public getVehicle() {
    return this.props.vehicle
  }

  public getUser() {
    return this.props.user
  }

  public setId(id: string) {
    this.id = id
  }

  public setLicenseNumber(licenseNumber: string) {
    this.props.licenseNumber = licenseNumber
  }

  public setBirthDate(birthDate: Date) {
    this.props.birthDate = birthDate
  }

  public setVehicle(vehicle: Vehicle) {
    this.props.vehicle = vehicle
  }

  public setUser(user: User) {
    this.props.user = user
  }
}
