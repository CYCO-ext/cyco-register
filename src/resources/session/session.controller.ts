import { Controller, Post, Body } from '@nestjs/common';
import { SignInUsecase } from '../../@core/application/usecases/session/sign-in.usecase';
import { TSessionInputDTO } from '../../@core/application/dto/input/session.dto.input';

@Controller('session')
export class SessionController {
  constructor(private readonly signInUsecase: SignInUsecase) { }

  @Post()
  create(@Body() createSessionDto: TSessionInputDTO) {
    return this.signInUsecase.execute(createSessionDto);
  }
}
