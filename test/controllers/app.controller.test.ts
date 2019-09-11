import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app/app.module';
import { bootstrap } from '../bootstrap';
import { INestApplication } from '@nestjs/common';
import * as i18n from 'i18n';

i18n.configure({
  locales: ['en', 'ru'],
  cookie: 'interviewcookie',
  directory: __dirname + '/locales'
});

describe('#main', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(i18n.init);
    bootstrap(app);

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
