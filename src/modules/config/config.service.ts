import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class ConfigService {
  constructor(filePath?: string) {
    if (filePath) {
      dotenv.config({path: filePath});
    }
  }

  get dbParams(): TypeOrmModuleOptions {
    const res = {
      type: process.env.DB_TYPE || 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      migrationsRun: true,
      logging: ['error'],
      url: process.env.DATABASE_URL,
      migrations: [__dirname + '/../../db/migrations/**/*{.ts,.js}'],
      cli: {
        migrationsDir: 'src/db/migrations',
      },
      keepConnectionAlive: true,
    } as TypeOrmModuleOptions;

    return res;
  }
}
