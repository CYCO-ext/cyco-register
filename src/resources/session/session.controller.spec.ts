import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { TSessionInputDTO } from '../../@core/application/dto/input/session.dto.input';
import { SignInUsecase } from '../../@core/application/usecases/session/sign-in.usecase';
import { IUserRepository } from '../../@core/domain/repositories/user-repository.repository';
import { IPasswordCryptography } from '../../@core/domain/services/password-cryptography.service';
import { IUserCryptographyService } from '../../@core/domain/services/user-cryptography.service';
import { IValidator } from '../../@core/domain/services/validator.service';
import { BcryptAdapter } from '../../infra/cryptography/password/bcrypt.adapter';
import { JwtAdapter } from '../../infra/cryptography/user/jwt.adapter';
import { prismaClient } from '../../infra/db/prisma';
import { UserRepositoryImpl } from '../../infra/db/prisma/repositories/user.prisma-repository';
import { loginSchema } from '../../infra/validation/yup/schemas/login.schema';
import { YupAdapter } from '../../infra/validation/yup/yup.adapter';

describe('SessionController', () => {
  let controller: SessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    controller = module.get<SessionController>(SessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
