import { IUserPayload } from "../data/user.payload";

export interface IUserCryptographyService {
  verify(token: string): IUserPayload;
  encrypt(object: IUserPayload): string;
}
