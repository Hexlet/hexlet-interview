import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/modules/app/app.module';
import { bootstrap } from './bootstrap';
import { INestApplication } from '@nestjs/common';

export const createTestingApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  bootstrap(app);

  await app.init();
  return app;
};
