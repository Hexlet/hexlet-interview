import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ConfigDto } from './config.dto';

export class ConfigService {
  private readonly envConfig: ConfigDto;

  constructor(filePath: string) {
    this.envConfig = (dotenv.parse(
      fs.readFileSync(filePath, 'utf8'),
    ) as unknown) as ConfigDto;
  }

  get dbParams(): PostgresConnectionOptions {
    const SOURCE_PATH = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

    return {
      type: 'postgres',
      host: this.envConfig.DB_HOST,
      port: this.envConfig.DB_PORT,
      username: this.envConfig.DB_USER,
      password: this.envConfig.DB_PASSWORD,
      database: this.envConfig.DB_NAME,
      synchronize: process.env.NODE_ENV === 'test',
      dropSchema: process.env.NODE_ENV === 'test',
      entities: [`${SOURCE_PATH}/modules/**/**.entity{.ts,.js}`],
      //   migrationsRun: process.env.NODE_ENV === 'test',
      logging: ['error'],
      migrations: [`${SOURCE_PATH}/migration/*.ts`],
      cli: {
        migrationsDir: `${SOURCE_PATH}/migration`,
      },
    };
  }
}
