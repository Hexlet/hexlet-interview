import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app/app.module';
import { bootstrap } from '../bootstrap';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../app.testing';

describe('Authorization test', () => {
  let app;

  beforeEach(async () => {
    app = await createTestingApp();

    app.repos.user.query('DELETE from user;');

    const user1 = await app.repos.user.create({
      firstname: 'Ivan',
      lastname: 'Susanin',
      password: '1234',
      email: 'isusanin@gmail.com',
      enabled: 1});
    await app.repos.user.save(user1);
    const user2 = await app.repos.user.create({
      firstname: 'Koзьма',
      lastname: 'Прутков',
      password: '1234',
      email: 'kprutkov@gmail.com',
      enabled: 1});
    await app.repos.user.save(user2);
    const user3 = await app.repos.user.create({
      firstname: 'Левша',
      lastname: 'Блохин',
      password: '1234',
      email: 'levsha@gmail.com',
      enabled: 1});
    await app.repos.user.save(user3);
  });

  it('GET protected page without authorization', () => {
    return request(app.http)
      .get('/user')
      .expect(HttpStatus.FORBIDDEN);
  });

  it('test valid credentials, login, logout', async () => {

    await request(app.http)
      .get('/user')
      .expect(HttpStatus.FORBIDDEN);

    const authInfo = {
      username: 'kprutkov@gmail.com',
      password: '1234',
    };
    const response = await request(app.http)
      .post('/auth/sign_in')
      .send(authInfo);
    expect(response.status).toBe(HttpStatus.FOUND);

    const { body: users } = await request(app.http)
      .get('/user')
      .set('Cookie', response.header['set-cookie'])
      .expect(HttpStatus.OK);
    console.log(JSON.stringify(users));
    await request(app.http)
      .get('/auth/sign_out')
      .expect(HttpStatus.FOUND);

    await request(app.http)
      .get('/user')
      .expect(HttpStatus.FORBIDDEN);

    });

  it('test disallow invalid credentials', async () => {
    const authInfo = {username: 'invadiemail@email.ru', password: '1234'};
    const response = await request(app.http)
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

    const response = await request(app.http)
      .post('/auth/sign_up')
      .send(userData);
    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('test register user with good data', async () => {
    const userData = {
      firstname: 'Александр',
      lastname: 'Матросов',
      email: 'amatrosov@gmail.com',
      password: '1234',
      confirmpassword: '1234'};

    const authInfo = {
      username: 'amatrosov@gmail.com',
      password: '1234'};

    const responseLoginUnexistingUser = await request(app.http)
      .post('/auth/sign_in')
      .send(authInfo);
    expect(responseLoginUnexistingUser.status).toBe(HttpStatus.UNAUTHORIZED);

    const response = await request(app.http)
      .post('/auth/sign_up')
      .send(userData);
    expect(response.status).toBe(HttpStatus.CREATED);

    const authInfo1 = {
      username: 'kprutkov@gmail.com',
      password: '1234',
    };
    const resp = await request(app.http)
      .post('/auth/sign_in')
      .send(authInfo1);
    expect(resp.status).toBe(HttpStatus.FOUND);

    await request(app.http)
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

    const response = await request(app.http)
      .post('/auth/sign_up')
      .send(userData);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  afterAll(async () => {
    await app.close();
  });
});
