import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { SignInUsecase } from '../../@core/application/usecases/session/sign-in.usecase';
import { TSessionInputDTO } from '../../@core/application/dto/input/session.dto.input';
import { JwtAdapter } from '../../infra/cryptography/user/jwt.adapter';
import { UserRepositoryImpl } from '../../infra/db/prisma/repositories/user.prisma-repository';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('session')
@ApiTags('Sessão')
export class SessionController {
  constructor(
    private readonly signInUsecase: SignInUsecase,
    private readonly jwtAdapter: JwtAdapter,
    private readonly userRepository: UserRepositoryImpl,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Autentica usuário e cria sessão' })
  @ApiBody({ schema: { type: 'object', required: ['email', 'password'], properties: {
    email: { type: 'string', format: 'email', example: 'usuario@empresa.com' },
    password: { type: 'string', format: 'password', example: 'Senha123!' },
  } } })
  create(@Body() createSessionDto: TSessionInputDTO) {
    return this.signInUsecase.execute(createSessionDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna a identidade do usuário autenticado' })
  async me(@Headers('authorization') authorization?: string) {
    const [scheme, token, extra] = authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token || extra) throw new UnauthorizedException();

    try {
      const payload = this.jwtAdapter.verify(token);
      const identity = await this.userRepository.resolveAuthenticatedIdentity(payload.id);
      if (!identity) throw new UnauthorizedException();
      return identity;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException();
    }
  }
}
