import { ConnectionOptions } from 'typeorm';

const env = process.env.NODE_ENV || 'development';

const commonOptions = {
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  logging: true,
  migrations: [__dirname + '/db/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
  keepConnectionAlive: true,
};

const test: ConnectionOptions = {
  type: 'sqlite',
  database: ':memory:',
  ...commonOptions,
};

const development: ConnectionOptions = {
  type: 'sqlite',
  database: __dirname + '/db/development.sqlite',
  ...commonOptions,
};

const production: ConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ...commonOptions,
};

const configs: { [key: string]: ConnectionOptions } = {
  development,
  test,
  production,
};

const config = configs[env];

export = config;
