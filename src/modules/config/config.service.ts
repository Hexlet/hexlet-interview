import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

export class ConfigService {
  private readonly envConfig: { [key: string]: string | number };

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get dbParams(): ConnectionOptions {
    const SOURCE_PATH = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

    return {
      type: this.envConfig.DB_TYPE,
      host: this.envConfig.DB_HOST,
      port: this.envConfig.DB_PORT,
      username: this.envConfig.DB_USER,
      password: this.envConfig.DB_PASSWORD,
      database: this.envConfig.DB_NAME,
      synchronize: false,
      entities: [`${SOURCE_PATH}/**/**.entity{.ts,.js}`],
      migrationsRun: true,
      logging: true,
      url: this.envConfig.DATABASE_URL,
      migrations: [`${SOURCE_PATH}/db/migrations/*.ts`],
      cli: {
        migrationsDir: 'src/db/migrations',
      },
    } as ConnectionOptions;
  }
}
