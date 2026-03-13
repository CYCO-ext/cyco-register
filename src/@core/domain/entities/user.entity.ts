import { Guard } from "../shared/guard/guard"
import { Result } from "../shared/result/result"
import { Password } from "../value-objects/password.value-object"
import { Phone } from "../value-objects/phone.value-object"

export type TUserProps = {
  email: string;
  name: string;
  password: Password;
  phone: Phone;
}

export class User {
  private id: string
  private props: TUserProps

  private constructor(props: TUserProps) {
    this.props = props
  }

  public static create(user: TUserProps): Result<User> {
    const guardResults = Guard.combine([
      Guard.againstNullOrUndefined(user.name, 'name'),
      Guard.againstNullOrUndefined(user.password, 'password'),
      Guard.againstNullOrUndefined(user.phone, 'phone'),
    ])

    if (guardResults.isFailure) {
      return Result.fail<User>(guardResults.getErrorValue());
    }

    return Result.ok<User>(new User(user));
  }

  public getId() {
    return this.id
  }

  public getEmail() {
    return this.props.email
  }

  public getName() {
    return this.props.name
  }

  public getPassword() {
    return this.props.password
  }

  public getPhone() {
    return this.props.phone
  }

  public setId(id: string) {
    this.id = id
  }

  public setEmail(email: string) {
    this.props.email = email
  }

  public setName(name: string) {
    this.props.name = name
  }

  public setPassword(password: Password) {
    this.props.password = password
  }

  public setPhone(phone: Phone) {
    this.props.phone = phone
  }
}
