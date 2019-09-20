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
    await request(app.getHttpServer())
      .get('/user')
      .expect(HttpStatus.FORBIDDEN);

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

  it('test disallow invalid credentials', async () => {
    const authInfo = {username: 'invadiemail@email.ru', password: '1234'};
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(authInfo);
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('test register existing user', async () => {
    const userData = {
      firstname: 'Koзьма',
      lastname: 'Прутков',
      email: 'kprutkov@gmail.com',
      password: '1234',
      confirmpassword: '1234'};

    const response = await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(userData);
    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('test register user with good data', async () => {
    const userData = {
      role: 'user',
      firstname: 'Александр',
      lastname: 'Матросов',
      email: 'amatrosov@gmail.com',
      password: '1234',
      confirmpassword: '1234'};

    const authInfo = {
      username: 'amatrosov@gmail.com',
      password: '1234'};

    const responseLoginUnexistingUser = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(authInfo);
    expect(responseLoginUnexistingUser.status).toBe(HttpStatus.UNAUTHORIZED);

    const response = await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(userData);
    expect(response.status).toBe(HttpStatus.CREATED);

    const authInfo1 = {
      username: 'kprutkov@gmail.com',
      password: '12345',
    };
    const resp = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(authInfo1);
    expect(resp.status).toBe(HttpStatus.FOUND);

    await request(app.getHttpServer())
      .get('/user')
      .set('Cookie', resp.header['set-cookie'])
      .expect(HttpStatus.OK);
  });

  it('test register user with invalid data', async () => {
    const userData = {
      firstname: '',
      lastname: 'Матросов',
      email: 'amatrosov',
      password: '1234',
      confirmpassword: ''};

    const response = await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(userData);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  afterAll(async () => {
    await app.close();
  });
});
