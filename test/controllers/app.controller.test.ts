import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp } from '../app.testing';

describe.only('#main', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200);
  });
});
