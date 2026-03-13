import { Guard } from '../shared/guard/guard';
import { Result } from '../shared/result/result';

export type TAddressProps = {
  zipCode: string;
  number?: string;
  complement?: string;
};

/**
 * A class representing a Address.
 */
export class Address {
  private props: TAddressProps;

  /**
   * Private constructor for creating a Address instance.
   * @param props - The properties of the address.
   */
  private constructor(props: TAddressProps) {
    this.props = props;
  }


  /**
   * Creates a new Address instance.
   * @param props - The properties of the address.
   * @returns A Result object containing the created Address instance or an error.
   */
  public static create(address: TAddressProps): Result<Address> {
    const guardResults = Guard.combine([
      Guard.againstNullOrUndefined(address.zipCode, 'zipCode')
    ]);
    if (guardResults.isFailure)
      return Result.fail<Address>(guardResults.getErrorValue());

    return Result.ok<Address>(new Address(address));
  }

  /**
   * Gets the zipcode of the address.
   * @returns The zipcode of the Address.
   */
  getZipCode() {
    return this.props.zipCode;
  }

  /**
   * Gets the number of the address.
   * @returns The number of the Address.
   */
  getNumber() {
    return this.props.number;
  }

  /**
   * Gets the complement of the address.
   * @returns The complement of the Address.
   */
  getComplement() {
    return this.props.complement;
  }
}
