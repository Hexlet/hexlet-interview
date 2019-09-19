import * as request from 'supertest';
import { User } from '../../src/modules/user/user.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../app.testing';
import { getRepository, Repository } from 'typeorm';

describe('Authorization test', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    app = await createTestingApp();
    userRepo = getRepository(User);

    const users = await userRepo.create([
      {
        firstname: 'Ivan',
        lastname: 'Susanin',
        password: '1234',
        email: 'isusanin@gmail.com',
        enabled: false,
      },
      {
        firstname: 'Koзьма',
        lastname: 'Прутков',
        password: '1234',
        email: 'kprutkov@gmail.com',
        enabled: false,
      },
      {
        firstname: 'Левша',
        lastname: 'Блохин',
        password: '1234',
        email: 'levsha@gmail.com',
        enabled: false,
      },
    ]);
    await userRepo.save(users);
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

    const authInfo = {
      username: 'kprutkov@gmail.com',
      password: '1234',
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

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
