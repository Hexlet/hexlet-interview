import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/modules/app/app.module';
import { bootstrap } from './bootstrap';
import { HttpStatus, INestApplication } from '@nestjs/common';

describe('Authorization test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    bootstrap(app);

    await app.init();
  });

/*
  it('GET protected page without authorization', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(HttpStatus.FORBIDDEN);
  });
*/
  it('test valid credentials', async () => {
    const authInfo = {
      "username": "two@email.ru",
      "password": "1234",
    };
    const response = await request(app.getHttpServer())
      .post('/login')
      .send(authInfo);
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.user.username).toBe('two@email.ru');
    expect(response.body.user.firstName).toBe('Adam');
    expect(response.body.user.lastName).toBe('User');
  });
/*
  it('disallow invalid credentials', async () => {
    const authInfo = {username: 'two@email.ru', password: '1234'};
    const response = await request(app.getHttpServer())
      .post('/login')
      .send(authInfo);
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });
*/
  afterAll(async () => {
    await app.close();
  });
});
