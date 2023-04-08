import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import jwtConfig from '@app/config/jwt.config';
import { UsersModule } from '@app/users/users.module';
import { AuthService } from '@app/auth/auth.service';
import { AuthController } from '@app/auth/auth.controller';
import { AccessTokenStrategy } from '@app/auth/strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
      load: [jwtConfig],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { JWT_SECRET, JWT_EXPIRATION_TIME } = configService.get('jwt');
        return {
          secret: JWT_SECRET,
          signOptions: {
            expiresIn: JWT_EXPIRATION_TIME,
          },
        };
      },
    }),
    UsersModule,
  ],
  providers: [AuthService, AccessTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
