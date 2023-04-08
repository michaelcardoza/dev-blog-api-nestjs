import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { DataSource } from 'typeorm';

import databaseConfig from '@app/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { host, port, database, password, username } =
          configService.get('database');
        return {
          type: 'postgres',
          host,
          port,
          database,
          password,
          username,
          synchronize: false,
          autoLoadEntities: true,
          retryDelay: 3000,
          retryAttempts: 10,
        };
      },
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
