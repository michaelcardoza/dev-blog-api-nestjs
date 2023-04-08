import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from '@app/auth/guards';
import { AuthUser } from '@app/auth/decorators';
import { UsersService } from '@app/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/me')
  profile(@AuthUser() user) {
    return this.usersService.profile(user.id);
  }

  @Get(':username')
  async findOneByUsername(@Param('username') username: string) {
    return this.usersService.findOneByUsername(username, {
      id: true,
      username: true,
    });
  }
}
