import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app/app.module';
import { bootstrap } from '../bootstrap';
import { INestApplication } from '@nestjs/common';

describe('#request', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    bootstrap(app);

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200);
  });

  it('create new request for interview', () => {
    return request(app.getHttpServer())
      .post('/request')
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
