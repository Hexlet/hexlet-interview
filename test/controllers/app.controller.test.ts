import * as request from 'supertest';
import { createTestingApp } from '../app.testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { clearDb } from '../fixtures.loader';

describe('#main', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.OK);
  });

  afterEach(async () => {
    await clearDb();
    await app.close();
  });
});
