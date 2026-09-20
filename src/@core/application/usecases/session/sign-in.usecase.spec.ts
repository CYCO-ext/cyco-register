import { User } from '../../../domain/entities/user.entity';
import { Password } from '../../../domain/value-objects/password.value-object';
import { Phone } from '../../../domain/value-objects/phone.value-object';
import { SignInUsecase } from './sign-in.usecase';

const makeUser = () => {
  const user = User.create({
    email: 'driver@example.com',
    name: 'Driver One',
    password: Password.create({ password: 'hashed-password' }).getValue(),
    phone: Phone.create({
      ddd: 11,
      ddi: 55,
      number: '961868671',
    }).getValue(),
  }).getValue();
  user.setId('deliveryman-id');
  return user;
};

describe('SignInUsecase', () => {
  const userRepository = {
    findByEmail: jest.fn(),
    getRoleByEmail: jest.fn(),
  };
  const userCryptography = {
    encrypt: jest.fn(),
  };
  const passwordCryptography = {
    compare: jest.fn(),
  };
  const validator = {
    validate: jest.fn(),
  };

  const makeUsecase = () =>
    new SignInUsecase(
      userRepository as any,
      userCryptography as any,
      passwordCryptography as any,
      validator as any,
      {},
    );

  beforeEach(() => {
    jest.clearAllMocks();
    validator.validate.mockReturnValue({ isValid: true });
    userRepository.findByEmail.mockResolvedValue(makeUser());
    userRepository.getRoleByEmail.mockResolvedValue('DELIVERYMAN');
    passwordCryptography.compare.mockResolvedValue(true);
    userCryptography.encrypt.mockReturnValue('token-value');
  });

  it('returns DELIVERYMAN when the signed-in user has a deliveryman profile', async () => {
    const output = await makeUsecase().execute({
      email: 'driver@example.com',
      password: '12345678',
    });

    expect(userRepository.getRoleByEmail).toHaveBeenCalledWith(
      'driver@example.com',
    );
    expect(output).toEqual({
      user: {
        id: 'deliveryman-id',
        email: 'driver@example.com',
        name: 'Driver One',
      },
      token: 'token-value',
      role: 'DELIVERYMAN',
    });
  });
});
