import * as request from 'supertest';
import * as nock from 'nock';
import {User} from '../../src/modules/user/user.entity';
import {HttpStatus, INestApplication} from '@nestjs/common';
import {createTestingApp} from '../app.testing';
import {getRepository, Repository} from 'typeorm';
import {loadFixtures, clearDb} from '../fixtures.loader';

describe('Authorization test', () => {
  let app: INestApplication;
  let users: {[key: string]: User};
  let userRepo: Repository<User>;

  beforeEach(async () => {
    app = await createTestingApp();
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
      .expect(HttpStatus.FOUND)
      .expect('Location', '/auth/sign_in');
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
      confirmpassword: '1234',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(userData);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('test register user with good data', async () => {
    const userData = {
      firstname: 'Александр',
      lastname: 'Матросов',
      email: 'amatrosov@gmail.com',
      password: '1234',
      confirmpassword: '1234',
    };

    const authInfo = {
      username: 'amatrosov@gmail.com',
      password: '1234',
    };

    const responseLoginUnexistingUser = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(authInfo);
    expect(responseLoginUnexistingUser.status).toBe(HttpStatus.UNAUTHORIZED);

    const response = await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(userData);
    expect(response.status).toBe(HttpStatus.FOUND);

    const authInfo1 = {
      username: 'kprutkov@gmail.com',
      password: '12345',
    };
    const resp = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(authInfo1);
    expect(resp.status).toBe(HttpStatus.FOUND);
  });

  it('test register user with invalid data', async () => {
    const userData = {
      firstname: '',
      lastname: 'Матросов',
      email: 'amatrosov',
      password: '1234',
      confirmpassword: '',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/sign_up')
      .send(userData);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('github auth url shoud redirect', async () => {
    await request(app.getHttpServer())
      .get('/auth/github')
      .expect(HttpStatus.FOUND);
  });

  it('test new user repeated sign in with Github', async () => {
    const userData = {
      id: '123456',
      login: 'whoami',
      name: 'John Galt',
      email: 'johngalt@gmail.com',
    };
    nock('https://github.com')
      .post('/login/oauth/access_token')
      .twice()
      .reply(200, {access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a', token_type: 'bearer'});

    nock('https://api.github.com')
      .get(/\/user*/)
      .times(4)
      .reply(200, userData);
    // first login creates user.
    await request(app.getHttpServer())
      .get('/auth/github/callback')
      .query({code: 'somecode'})
      .expect(HttpStatus.FOUND);
    const createdUser = await userRepo.findOne({
      where: { githubUid: userData.id },
    });
    expect(createdUser.email).toEqual(userData.email);
    // second login finds user in db.
    await request(app.getHttpServer())
      .get('/auth/github/callback')
      .query({code: 'somecode'})
      .expect(HttpStatus.FOUND);
  });

  it('test Github auth for user than already exist with local auth', async () => {
    const userData = {
      id: '123456',
      login: 'kuzya',
      name: 'Kuzma Prutkov',
      email: 'kprutkov@gmail.com',
    };

    nock('https://github.com')
      .post('/login/oauth/access_token')
      .reply(200, {access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a', token_type: 'bearer'});
    nock('https://api.github.com')
      .get(/\/user*/)
      .twice()
      .reply(200, userData);

    await request(app.getHttpServer())
      .get('/auth/github/callback')
      .query({code: 'somecode'})
      .expect(HttpStatus.FOUND);

    // first login with github shoud add githubUid to user
    const createdUser = await userRepo.findOne({
      where: { email: userData.email },
    });
    expect(createdUser.githubUid).toEqual(userData.id);
  });

  it('shoud fail with bad response', async () => {
    nock('https://github.com')
      .post('/login/oauth/access_token')
      .reply(200, {access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a', token_type: 'bearer'});
    nock('https://api.github.com')
      .get('/user')
      .reply(403);
    await request(app.getHttpServer())
      .get('/auth/github/callback')
      .query({code: 'somecode'})
      .expect(HttpStatus.UNAUTHORIZED);
  });

  afterEach(async () => {
    await clearDb();
    await app.close();
  });
});
