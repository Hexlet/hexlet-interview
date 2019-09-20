import * as request from 'supertest';
import { User } from '../../src/modules/user/user.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../app.testing';
import { loadFixtures } from '../fixtures.loader';
import { _ } from 'lodash';

describe('Authorization test', () => {
  let app: INestApplication;
  let users: {[key: string]: User};

  beforeAll(async () => {
    app = await createTestingApp();
    users = (await loadFixtures()).User;
  });

  it('GET protected page without authorization', async () => {
    await request(app.getHttpServer())
      .get('/user')
      .expect(HttpStatus.FORBIDDEN);
  });

  it('test valid credentials, login, logout', async () => {
    const kozma = users.kozma;
    const authInfo = {
      username: kozma.email,
      password: '12345',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(authInfo);

    expect(response.status).toBe(HttpStatus.FOUND);

    await request(app.getHttpServer())
      .get('/user')
      .set('Cookie', response.header['set-cookie'])
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get('/auth/sign_out')
      .expect(HttpStatus.FOUND);

    await request(app.getHttpServer())
      .get('/user')
      .expect(HttpStatus.FORBIDDEN);
  });

  it('disallow invalid credentials', async () => {
    const authInfo = {username: 'invadiemail@email.ru', password: '1234'};
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(authInfo);

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  afterAll(async () => {
    await app.close();
  });
});
