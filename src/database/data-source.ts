import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceoptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [`${__dirname}/../**/*.entity.ts`],
  migrations: [`${__dirname}/migrations/*.ts`],
  subscribers: [],
  migrationsTableName: 'migrations',
};

export default new DataSource(dataSourceoptions);
