import * as request from 'supertest';
import { User } from '../../src/modules/user/user.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../app.testing';
import { loadFixtures } from '../fixtures.loader';
import { _ } from 'lodash';
import { random } from 'faker';
import { getRepository, Repository } from 'typeorm';
import { MailerService } from '../../src/modules/mailer/mailer.service';

describe('Authorization test', () => {
  let app: INestApplication;
  let users: { [key: string]: User };
  let userRepo: Repository<User>;

  const userData = {
    firstname: 'Александр',
    lastname: 'Матросов',
    email: 'amatrosov@gmail.com',
    password: '1234',
    confirmpassword: '1234',
  };
  const existingUserData = {
    firstname: 'Koзьма',
    lastname: 'Прутков',
    email: 'kprutkov@gmail.com',
    password: '12345',
    confirmpassword: '12345',
  };
  const existingUserAuthInfo = {
    username: existingUserData.email,
    password: existingUserData.password,
  };
  const newUserAuthInfo = {
    username: userData.email,
    password: userData.password,
  };
  let mailerService: MailerService;

  beforeAll(async () => {
    app = await createTestingApp();
    mailerService = app.get<MailerService>(MailerService);
    users = (await loadFixtures()).User;
    userRepo = getRepository(User);
  });

  it('GET protected page without authorization', async () => {
    await request(app.getHttpServer())
      .get('/user')
      .expect(HttpStatus.FOUND)
      .expect('Location', '/auth/sign_in');
  });

  it('test valid credentials, login, logout', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(existingUserAuthInfo);

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
      .expect(HttpStatus.FOUND)
      .expect('Location', '/auth/sign_in');
  });

  it('test disallow invalid credentials', async () => {
    const authInfo = { username: 'invadiemail@email.ru', password: '1234' };
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(authInfo);
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('test register existing user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(existingUserData);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('test register user with good data not to be finished', async () => {
    const responseLoginUnexistingUser = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(newUserAuthInfo);
    expect(responseLoginUnexistingUser.status).toBe(HttpStatus.UNAUTHORIZED);

    const response = await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(userData);
    expect(response.status).toBe(HttpStatus.FOUND);

    const resp = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(existingUserAuthInfo);
    expect(resp.status).toBe(HttpStatus.FOUND);
  });

  it('register new user should not to be finished if verify link has never be activated', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(userData);

    await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(newUserAuthInfo)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('register new user should be succeded if link were has been activated', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(userData);

    const { token } = await userRepo.findOne({ email: userData.email });

    await request(app.getHttpServer())
      .get(`/auth/verify/${token}`)
      .expect(HttpStatus.FOUND);

    await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(newUserAuthInfo)
      .expect(HttpStatus.FOUND);
    expect(mailerService.sendVerifyLink).toBeCalled();
  });

  it('test register user with invalid data', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send({ ...userData, firstname: '', confirmpassword: '' });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('GET auth/verify/:token return 404 if token is not exists', async () => {
    await request(app.getHttpServer())
      .get(`/auth/verify/${random.uuid()}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
