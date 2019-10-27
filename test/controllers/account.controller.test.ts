import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../app.testing';
import { loadFixtures, clearDb } from '../fixtures.loader';

describe('#interview', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
    await loadFixtures();
  });

  it('get user application list', async () => {
    const userAuthInfo = {
      username: 'kprutkov@gmail.com',
      password: '12345',
    };
    const res = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(userAuthInfo)
      .expect(HttpStatus.FOUND)
      .expect('Location', '/');
    const cookie = res.header['set-cookie'];
    return request(app.getHttpServer())
      .get('/my/application')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);
  });

  it("unauthorized user can't get user application list", () => {
    return request(app.getHttpServer())
      .get('/interview/manage/application')
      .expect(HttpStatus.FOUND);
  });

  afterEach(async () => {
    await clearDb();
    await app.close();
  });
});
