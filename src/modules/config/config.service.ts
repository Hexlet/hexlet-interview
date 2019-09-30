import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface MailParams {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromMail: string;
}

export class ConfigService {
  constructor(filePath?: string) {
    if (filePath) {
      dotenv.config({ path: filePath });
    }
  }

  get mailParams(): MailParams {
    return {
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      pass: process.env.MAIL_PASSWORD,
      user: process.env.MAIL_USER,
      fromMail: process.env.FROM_MAIL,
    };
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
      logging: !!process.env.DB_LOGGING,
      ...commonOptions,
    };

    const development: TypeOrmModuleOptions = {
      type: 'sqlite',
      database: __dirname + '/../../../interview.sqlite',
      logging: true,
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
