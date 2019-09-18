import * as request from 'supertest';
import { createTestingApp } from '../app.testing';
import { HttpStatus, INestApplication } from '@nestjs/common';

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
    if (app) {
      await app.close();
    }
  });
});
