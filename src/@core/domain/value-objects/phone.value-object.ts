import { log } from "console";
import { Guard } from "../shared/guard/guard";
import { Result } from "../shared/result/result";

export type TPhoneProps = {
  ddd: number;
  ddi: number;
  number: string;
};

/**
 * Class representing a phone number.
 */
export class Phone {
  private props: TPhoneProps;

  /**
   * Private constructor for the Phone class.
   * @param props The properties of the phone number.
   */
  private constructor(props: TPhoneProps) {
    this.props = props;
  }

  /**
   * Static method to create a new instance of the Phone class.
   * @param props The properties of the phone number.
   * @returns A Result object containing either a new instance of the Phone class or an error message.
   */
  public static create(props: TPhoneProps): Result<Phone> {
    const guardResults = Guard.combine([
      Guard.againstNullOrUndefined(props, 'props'),
      Guard.againstNullOrUndefined(props?.ddd, 'ddd'),
      Guard.againstNullOrUndefined(props?.ddi, 'ddi'),
      Guard.againstNullOrUndefined(props?.number, 'number'),
      Guard.againstAtLeast(8, props?.number.toString()),
      Guard.againstAtMost(9, props?.number.toString()),
    ]);
    if (guardResults.isFailure) {
      return Result.fail<Phone>(guardResults.getErrorValue());
    }
    return Result.ok<Phone>(new Phone(props));
  }

  getDdd(): number {
    return this.props.ddd;
  }

  getDdi(): number {
    return this.props.ddi;
  }

  getNumber(): string {
    return this.props.number;
  }

  /**
   * Getter for the formatted phone number.
   * @returns The formatted phone number in the format: +DDI (DDD) NUMBER.
   */
  getPhone(): string {
    return `+${this.getDdi()} (${this.getDdd()}) ${this.getNumber()}`;
  }

  public static createFromString(phone: string): Result<Phone> {
    const [ddi, ddd, number] = phone.split(" ")
    const formatedDdi = +ddi.substring(1)
    const formatedDdd = +ddd.substring(0).substring(1, ddd.length - 1)
    const newPhone = Phone.create({ ddi: formatedDdi, ddd: formatedDdd, number })
    return newPhone
  }
}
