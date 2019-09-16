import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/modules/app/app.module';
import { bootstrap } from './bootstrap';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from './app.testing';

describe('Authorization test', () => {
  let app;

  beforeEach(async () => {
    app = await createTestingApp();

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

  it('test valid credentials', async () => {

    await request(app.http)
      .get('/user')
      .expect(HttpStatus.FORBIDDEN);

    const authInfo = {
      username: 'kprutkov@gmail.com',
      password: '1234',
    };
    const response = await request(app.http)
      .post('/login')
      .send(authInfo);
    expect(response.status).toBe(HttpStatus.FOUND);
    await request(app.http)
      .get('/user')
      .set('Cookie', response.header['set-cookie'])
      .expect(HttpStatus.OK);
  });

  it('disallow invalid credentials', async () => {
    const authInfo = {username: 'two@email.ru', password: '1234'};
    const response = await request(app.http)
      .post('/login')
      .send(authInfo);
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  afterAll(async () => {
    await app.close();
  });
});
