import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class ConfigService {
  constructor(filePath?: string) {
    if (filePath) {
      dotenv.config({path: filePath});
    }
  }

  get dbParams(): TypeOrmModuleOptions {
    const env = process.env.NODE_ENV || 'development';

    const commonOptions = {
      synchronize: false,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      migrationsRun: true,
      url: process.env.DATABASE_URL,
      migrations: [__dirname + '/../../db/migrations/**/*{.ts,.js}'],
      cli: {
        migrationsDir: 'src/db/migrations',
      },
      keepConnectionAlive: true,
    };

    const test: TypeOrmModuleOptions = {
      type: 'sqlite',
      database: ':memory:',
      logging: false,
      ...commonOptions,
    };

    const development: TypeOrmModuleOptions = {
      type: 'sqlite',
      database: __dirname + '/../../db/development.sqlite',
      logging: false,
      ...commonOptions,
    };

    const production: TypeOrmModuleOptions = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      logging: true,
      ...commonOptions,
    };

    const configs: { [key: string]: TypeOrmModuleOptions } = {
      development,
      test,
      production,
    };

    return configs[env];
  }
}
