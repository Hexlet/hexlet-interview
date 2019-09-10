import { ConnectionOptions } from 'typeorm';

const env = process.env.NODE_ENV === 'test' || !process.env.NODE_ENV ? 'test' : process.env.NODE_ENV;

const commonOptions = {
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  logging: true,
  migrations: [__dirname + '/db/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
};

const testConfig: ConnectionOptions = {
  type: 'sqlite',
  database: __dirname + '/db/development.sqlite',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  ...commonOptions,
};

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ...commonOptions,
};

const realConfig = env === 'test' ? testConfig : config;

export = realConfig;
