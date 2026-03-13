import { IUserPayload } from "../../../@core/domain/data/user.payload";
import { IUserCryptographyService } from "../../../@core/domain/services/user-cryptography.service";
import * as jwt from 'jsonwebtoken';

export class JwtAdapter implements IUserCryptographyService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string,
  ) { }
  verify(value: string): IUserPayload {
    return jwt.verify(value, this.secret) as IUserPayload;
  }
  encrypt(object: IUserPayload): string {
    return jwt.sign(object, this.secret, { expiresIn: this.expiresIn });
  }
}
