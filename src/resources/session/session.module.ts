import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { UserRepositoryImpl } from '../../infra/db/prisma/repositories/user.prisma-repository';
import { prismaClient } from '../../infra/db/prisma';
import { YupAdapter } from '../../infra/validation/yup/yup.adapter';
import { JwtAdapter } from '../../infra/cryptography/user/jwt.adapter';
import { BcryptAdapter } from '../../infra/cryptography/password/bcrypt.adapter';
import { SignInUsecase } from '../../@core/application/usecases/session/sign-in.usecase';
import { IUserRepository } from '../../@core/domain/repositories/user-repository.repository';
import { IUserCryptographyService } from '../../@core/domain/services/user-cryptography.service';
import { IPasswordCryptography } from '../../@core/domain/services/password-cryptography.service';
import { IValidator } from '../../@core/domain/services/validator.service';
import { TSessionInputDTO } from '../../@core/application/dto/input/session.dto.input';
import { loginSchema } from '../../infra/validation/yup/schemas/login.schema';

@Module({
  controllers: [SessionController],
  providers: [
    {
      provide: UserRepositoryImpl,
      useFactory: () => new UserRepositoryImpl(prismaClient),
    },
    {
      provide: YupAdapter,
      useClass: YupAdapter,
    },
    {
      provide: JwtAdapter,
      useFactory: () => {
        return new JwtAdapter(process.env.SECRET, process.env.EXPIRES_IN);
      },
    },
    {
      provide: BcryptAdapter,
      useFactory: () => {
        return new BcryptAdapter(Number(process.env.SALT));
      },
    },
    {
      provide: SignInUsecase,
      useFactory: (
        userRepository: IUserRepository,
        userCriptography: IUserCryptographyService,
        passwordCryptography: IPasswordCryptography,
        validator: IValidator<TSessionInputDTO>,
      ) => {
        return new SignInUsecase(
          userRepository,
          userCriptography,
          passwordCryptography,
          validator,
          loginSchema,
        );
      },
      inject: [UserRepositoryImpl, JwtAdapter, BcryptAdapter, YupAdapter],
    },
  ],
})
export class SessionModule { }
