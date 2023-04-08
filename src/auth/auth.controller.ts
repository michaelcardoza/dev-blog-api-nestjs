import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { LoginDto, SignupDto } from '@app/auth/dto';
import { AuthService } from '@app/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('signup')
  async signup(@Body() data: SignupDto) {
    return this.authService.signup(data);
  }
}
