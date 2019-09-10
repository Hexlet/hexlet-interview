import * as faker from 'faker';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/modules';
import { CreateInterviewDto } from '../src/modules/interview/dto';
import { HttpStatus } from '@nestjs/common';

describe.only('AppController (e2e)', () => {
  jest.setTimeout(15_000);
  let app;
  const createInterviewData: CreateInterviewDto = {
    interviewee: faker.name.firstName(),
    interviewer: faker.name.lastName(),
    videoLink: faker.internet.url(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/interview (GET)', async () => {
    await request(app.getHttpServer())
      .get('/interview')
      .expect(HttpStatus.OK)
      .expect([]);
  });

  it('/interview (POST)', async () => {
    await request(app.getHttpServer())
      .post('/interview')
      .send(createInterviewData)
      .expect(HttpStatus.CREATED);
  });
});
