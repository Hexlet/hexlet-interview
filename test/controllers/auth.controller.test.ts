import * as request from 'supertest';
import * as nock from 'nock';
import { User } from '../../src/modules/user/user.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../app.testing';
import { clearDb, loadFixtures } from '../fixtures.loader';
import { _ } from 'lodash';
import { random } from 'faker';
import { getRepository, Repository } from 'typeorm';
import { MailerService } from '../../src/modules/mailer/mailer.service';

describe('Authorization test', () => {
  let app: INestApplication;
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

  beforeEach(async () => {
    app = await createTestingApp();
    await loadFixtures();
    mailerService = app.get<MailerService>(MailerService);
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

    const { confirmationToken } = await userRepo.findOne({
      email: userData.email,
    });

    await request(app.getHttpServer())
      .get(`/auth/verify/${confirmationToken}`)
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
      .expect(HttpStatus.NOT_FOUND);
  });

  it('github auth url shoud redirect', async () => {
    await request(app.getHttpServer())
      .get('/auth/github')
      .expect(HttpStatus.FOUND);
  });

  it('test new user repeated sign in with Github', async () => {
    const newUserData = {
      id: '123456',
      login: 'whoami',
      name: 'John Galt',
      email: 'johngalt@gmail.com',
    };
    nock('https://github.com')
      .post('/login/oauth/access_token')
      .twice()
      .reply(200, {
        access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a',
        token_type: 'bearer',
      });

    nock('https://api.github.com')
      .get(/\/user*/)
      .times(4)
      .reply(200, newUserData);
    // first login creates user.
    await request(app.getHttpServer())
      .get('/auth/github/callback')
      .query({ code: 'somecode' })
      .expect(HttpStatus.FOUND);
    const createdUser = await userRepo.findOne({
      where: { githubUid: newUserData.id },
    });
    expect(createdUser.email).toEqual(newUserData.email);
    // second login finds user in db.
    await request(app.getHttpServer())
      .get('/auth/github/callback')
      .query({ code: 'somecode' })
      .expect(HttpStatus.FOUND);
  });

  it('test Github auth for user than already exist with local auth', async () => {
    const existGithubUserData = {
      id: '123456',
      login: 'kuzya',
      name: 'Kuzma Prutkov',
      email: existingUserData.email,
    };

    nock('https://github.com')
      .post('/login/oauth/access_token')
      .reply(200, {
        access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a',
        token_type: 'bearer',
      });
    nock('https://api.github.com')
      .get(/\/user*/)
      .twice()
      .reply(200, existGithubUserData);

    await request(app.getHttpServer())
      .get('/auth/github/callback')
      .query({ code: 'somecode' })
      .expect(HttpStatus.FOUND);

    // first login with github shoud add githubUid to user
    const createdUser = await userRepo.findOne({
      where: { email: existGithubUserData.email },
    });
    expect(createdUser.githubUid).toEqual(existGithubUserData.id);
  });

  it('shoud fail with bad response', async () => {
    nock('https://github.com')
      .post('/login/oauth/access_token')
      .reply(200, {
        access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a',
        token_type: 'bearer',
      });
    nock('https://api.github.com')
      .get('/user')
      .reply(403);
    await request(app.getHttpServer())
      .get('/auth/github/callback')
      .query({ code: 'somecode' })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  afterEach(async () => {
    await app.close();
    await clearDb();
  });
});
