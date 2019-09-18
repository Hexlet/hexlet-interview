import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class ConfigService {
  private readonly envConfig: { [key: string]: string | number };

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get dbParams(): TypeOrmModuleOptions {
    const res = {
      type: this.envConfig.DB_TYPE,
      host: this.envConfig.DB_HOST,
      port: this.envConfig.DB_PORT,
      username: this.envConfig.DB_USER,
      password: this.envConfig.DB_PASSWORD,
      database: this.envConfig.DB_NAME,
      synchronize: false,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      migrationsRun: true,
      logging: ['error'],
      url: this.envConfig.DATABASE_URL,
      migrations: [__dirname + '/../../db/migrations/**/*{.ts,.js}'],
      cli: {
        migrationsDir: 'src/db/migrations',
      },
      keepConnectionAlive: true,
    } as TypeOrmModuleOptions;

    return res;
  }
}
