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
  url: process.env.DATABASE_URL,
  ...commonOptions,
};

const realConfig = env === 'test' ? testConfig : config;

export = realConfig;
