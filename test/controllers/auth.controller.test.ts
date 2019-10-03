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

  const newUserData = {
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
    username: newUserData.email,
    password: newUserData.password,
  };
  let mailerService: MailerService;

  beforeEach(async () => {
    app = await createTestingApp();
    await loadFixtures();
    mailerService = app.get<MailerService>(MailerService);
    userRepo = getRepository(User);
  });

  it('Get protected page without authorization', async () => {
    await request(app.getHttpServer())
      .get('/interview/new')
      .expect(HttpStatus.FOUND)
      .expect('Location', '/auth/sign_in');
  });

  it('test valid credentials, login, logout', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(existingUserAuthInfo)
      .expect(HttpStatus.FOUND);

    await request(app.getHttpServer())
      .get('/interview/new')
      .set('Cookie', response.header['set-cookie'])
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get('/auth/sign_out')
      .expect(HttpStatus.FOUND);

    await request(app.getHttpServer())
      .get('/interview/new')
      .expect(HttpStatus.FOUND)
      .expect('Location', '/auth/sign_in');
  });

  it('test disallow invalid credentials', async () => {
    const authInfo = {username: 'invadiemail@email.ru', password: '1234'};
    await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(authInfo)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('test register existing user', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(existingUserData)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('test register user with good data', async () => {
    request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(newUserAuthInfo)
      .expect(HttpStatus.UNAUTHORIZED)
      .expect('Location', '/auth/sign_in');

    await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(newUserData)
      .expect(HttpStatus.FOUND)
      .expect('Location', '/');

    await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(existingUserAuthInfo)
      .expect(HttpStatus.FOUND)
      .expect('Location', '/');
  });

  it('register new user should not to be finished if verify link has never be activated', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(newUserData);

    await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(newUserData)
      .expect(HttpStatus.BAD_REQUEST);
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
    const newGithubUserData = {
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
      .reply(200, newGithubUserData);

    // first login creates user.
    await request(app.getHttpServer())
      .get('/auth/github/callback')
      .query({ code: 'somecode' })
      .expect(HttpStatus.FOUND);

    const createdUser = await userRepo.findOne({
      where: { githubUid: newGithubUserData.id },
    });

    expect(createdUser.email).toEqual(newGithubUserData.email);

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
