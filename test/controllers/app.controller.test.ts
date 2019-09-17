import * as request from 'supertest';
import { createTestingApp, TestingApp } from '../app.testing';
import { HttpStatus } from '@nestjs/common';

describe('#main', () => {
  let app: TestingApp;

  beforeEach(async () => {
    app = await createTestingApp();
  });

  it('/ (GET)', () => {
    return request(app.http)
      .get('/')
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
