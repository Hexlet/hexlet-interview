import * as request from 'supertest';
import { User } from '../../src/modules/user/user.entity';
import { Interview } from '../../src/modules/interview/interview.entity';
import { createTestingApp } from '../app.testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { loadFixtures, clearDb } from '../fixtures.loader';

describe('#interview', () => {
  let app: INestApplication;
  let interviewRepo: Repository<Interview>;
  let userRepo: Repository<User>;
  let users: {[key: string]: User};

  const adminAuthInfo = {
    username: 'admin@admin.com',
    password: 'admin',
  };

  const userAuthInfo = {
    username: 'kprutkov@gmail.com',
    password: '12345',
  };

  beforeEach(async () => {
    app = await createTestingApp();
    users = (await loadFixtures()).User;
    interviewRepo = getRepository(Interview);
    userRepo = getRepository(User);
  });

  it('cannot view interviews if not admin', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(userAuthInfo)
      .expect(HttpStatus.FOUND)
      .then((res) => {
        return request(app.getHttpServer())
          .get('/interview')
          .set('Cookie', res.header['set-cookie'])
          .expect(HttpStatus.NOT_FOUND);
      });
  });

  it('show all interviews', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(adminAuthInfo)
      .expect(HttpStatus.FOUND)
      .expect('Location', '/')
      .then((res) => {
        return request(app.getHttpServer())
          .get('/interview')
          .set('Cookie', res.header['set-cookie'])
          .expect(HttpStatus.OK);
      })
  });

  it('create new interview', async () => {
    const kozma = users.kozma;
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send({
        username: kozma.email,
        password: '12345',
      });

    await request(app.getHttpServer())
      .post('/interview')
      .set('Cookie', response.header['set-cookie'])
      .send({
        profession: 'Backend PHP Developer',
        position: 'Junior',
      })
      .expect(HttpStatus.FOUND)
      .expect('Location', '/');

    const reloadedUser = await userRepo.findOne(kozma.id, { relations: ['interviews'] });

    expect(reloadedUser.interviews.length).toEqual(1);
  });

  afterEach(async () => {
    await clearDb();
    await app.close();
  });
});
