import * as request from 'supertest';
import * as nock from 'nock';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { random } from 'faker';
import { getRepository, Repository } from 'typeorm';
import { createTestingApp, mailStub } from '../app.testing';
import { clearDb, loadFixtures } from '../fixtures.loader';
import { User } from '../../src/modules/user/user.entity';

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

  beforeEach(async () => {
    app = await createTestingApp();
    await loadFixtures();
    userRepo = getRepository(User);
  });

  it('get protected page without authorization will redirect to sign in', async () => {
    return request(app.getHttpServer())
      .get('/interview/new')
      .expect(HttpStatus.FOUND)
      .expect('Location', '/auth/sign_in');
  });

  it('login with valid credentials', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(existingUserAuthInfo)
      .expect(HttpStatus.FOUND)
      .then(res => {
        request(app.getHttpServer())
          .get('/interview/new')
          .set('Cookie', res.header['set-cookie'])
          .expect(HttpStatus.OK);
      });
  });

  it('login with invalid credentials', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign_in')
      .send({ username: 'invadidemail@email.ru', password: 'not_exists' })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('test register existing user', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(existingUserData)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('register user should send email with verification link', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(newUserData)
      .expect('Location', '/');

    const user = await userRepo.findOne({ email: newUserData.email });
    expect(user).toBeDefined();
    expect(user!.verified).toBeFalsy(); // es

    const mails = mailStub.sentMail;
    expect(mails.length).toEqual(1);

    const mail = mails[0];
    expect(mail.data.to).toEqual(newUserData.email);
    expect(mail.data.html.includes(user!.confirmationToken)).toBeTruthy();
  });

  it('GET auth/verify/:token return 404 if token does not exists', async () => {
    return request(app.getHttpServer())
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
      .reply(200);

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
      .reply(200);

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

  it('should fail with bad response', async () => {
    nock('https://github.com')
      .post('/login/oauth/access_token')
      .reply(200);

    nock('https://api.github.com')
      .get('/user')
      .reply(403);

    await request(app.getHttpServer())
      .get('/auth/github/callback')
      .query({ code: 'somecode' })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  afterEach(async () => {
    await clearDb();
    await app.close();
  });
});
