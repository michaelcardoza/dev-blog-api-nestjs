import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PostgresErrorCode } from '@app/database/postgres-error-codes.enum';
import { LoginDto, SignupDto } from '@app/auth/dto';
import { UsersService } from '@app/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(data: LoginDto) {
    const { username, password } = data;
    const user = await this.validateUser(username);
    await this.verifyPassword(password, user.password);

    return {
      id: user.id,
      accessToken: this.jwtService.sign({
        id: user.id,
        username: user.username,
        email: user.email,
      }),
    };
  }

  async signup(data: SignupDto) {
    try {
      return await this.usersService.create(data);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(['Email or Username already exists']);
      }
      throw new InternalServerErrorException(['Something went wrong']);
    }
  }

  private async validateUser(username: string) {
    try {
      return await this.usersService.findOneByUsername(username, {
        id: true,
        email: true,
        username: true,
        password: true,
      });
    } catch (error) {
      throw new BadRequestException(['Wrong credentials provided']);
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException(['Wrong credentials provided']);
    }
  }
}
