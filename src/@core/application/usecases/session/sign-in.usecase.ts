import { IUserRepository } from "../../../domain/repositories/user-repository.repository"
import { IPasswordCryptography } from "../../../domain/services/password-cryptography.service"
import { IUserCryptographyService } from "../../../domain/services/user-cryptography.service"
import { IValidator } from "../../../domain/services/validator.service"
import { UnauthorizedException } from "../../../domain/shared/exceptions/unauthorized.exception"
import { UnprocessableException } from "../../../domain/shared/exceptions/unprocessable.exception"
import { TSessionInputDTO } from "../../dto/input/session.dto.input"
import { TSessionOutputDTO } from "../../dto/output/session.dto.output"

export class SignInUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userCryptography: IUserCryptographyService,
    private readonly passwordCryptography: IPasswordCryptography,
    private readonly validator: IValidator<TSessionInputDTO>,
    private readonly schema: object
  ) { }

  async execute(dto: TSessionInputDTO): Promise<TSessionOutputDTO> {
    const { isValid, errorsResult } = this.validator.validate(this.schema, dto)
    if (!isValid) throw new UnprocessableException(errorsResult)

    const user = await this.userRepository.findByEmail(dto.email)

    const isPasswordValid = await this.passwordCryptography.compare(
      dto.password,
      user.getPassword().getPassword()
    )

    if (!isPasswordValid) throw new UnauthorizedException()

    const token = this.userCryptography.encrypt({
      id: user.getId(),
      email: user.getEmail(),
    })
    return { user: { email: user.getEmail(), name: user.getName() }, token }
  }
}
