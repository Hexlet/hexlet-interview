import { parse, DotenvParseOutput } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { readFileSync } from 'fs';

type Env = 'production' | 'test' | 'development';

export interface MailParams {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
  requireTLS: boolean;
  fromMail: string;
}

export class ConfigService {
  env: Env;
  private readonly envConfig: DotenvParseOutput;

  constructor() {
    this.env = (process.env.NODE_ENV || 'development') as Env;
    const envFileName = this.env === 'production' ? '.env' : `${this.env}.env`;
    const envFilePath = join(__dirname, '../../..', envFileName);
    this.envConfig = parse(readFileSync(envFilePath));
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  get appPort(): number {
    return Number(this.get('PORT')) || 3000;
  }

  get mailParams(): MailParams {
    return {
      host: this.get('MAIL_HOST'),
      port: Number(this.get('MAIL_PORT')),
      pass: this.get('MAIL_AUTH_PASSWORD'),
      user: this.get('MAIL_AUTH_USER'),
      secure: this.get('MAIL_SECURE') === 'true',
      requireTLS: this.get('MAIL_SECURE') === 'true',
      fromMail: this.get('MAIL_FROM'),
    };
  }

  get dbParams(): TypeOrmModuleOptions {
    const commonOptions = {
      synchronize: false,
      entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
      migrationsRun: true,
      migrations: [`${__dirname}/../../db/migrations/**/*{.ts,.js}`],
      cli: {
        migrationsDir: 'src/db/migrations',
      },
      keepConnectionAlive: true,
      logging: !!this.get('DB_LOGGING'),
    };

    const test: TypeOrmModuleOptions = {
      ...commonOptions,
      type: 'postgres',
      host: 'localhost',
      port: Number(this.get('DB_PORT')),
      username: this.get('DB_USER'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_NAME'),
    };

    const development: TypeOrmModuleOptions = {
      ...commonOptions,
      type: 'postgres',
      host: 'localhost',
      port: Number(this.get('DB_PORT')),
      username: this.get('DB_USER'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_NAME'),
    };

    const production: TypeOrmModuleOptions = {
      ...commonOptions,
      type: 'postgres',
      url: this.get('DATABASE_URL'),
      logging: true,
    };

    const configs: { [key in Env]: TypeOrmModuleOptions } = {
      development,
      test,
      production,
    };

    return configs[this.env];
  }
}
