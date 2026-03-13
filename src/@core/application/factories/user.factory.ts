import { User } from "../../domain/entities/user.entity";
import { left } from "../../domain/shared/result/left.result";
import { Response } from "../../domain/shared/result/response.result";
import { right } from "../../domain/shared/result/right.result";
import { Password } from "../../domain/value-objects/password.value-object";
import { Phone } from "../../domain/value-objects/phone.value-object";

type TUserInput = {
  password: string;
  email: string;
  name: string;
  phone: {
    ddd: number;
    ddi: number;
    number: string;
  };
}

export const userFactory = (user: TUserInput): Response<User> => {
  const password = Password.create({ password: user.password })
  if (password.isFailure) return left(password)

  const phone = Phone.create(user.phone)
  if (phone.isFailure) return left(phone)

  const userEntity = User.create({
    name: user.name,
    phone: phone.getValue(),
    email: user.email,
    password: password.getValue()
  })
  if (userEntity.isFailure) return left(userEntity)
  return right(userEntity)
}
