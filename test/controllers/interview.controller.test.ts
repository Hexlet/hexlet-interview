import * as request from 'supertest';
import { User } from '../../src/modules/user/user.entity';
import { Interview } from '../../src/modules/interview/interview.entity';
import { createTestingApp } from '../app.testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { loadFixtures } from '../fixtures.loader';

describe('#interview', () => {
  let app: INestApplication;
  let interviewRepo: Repository<Interview>;
  let users: {[key: string]: User};

  beforeAll(async () => {
    app = await createTestingApp();
    users = (await loadFixtures()).User;
    interviewRepo = getRepository(Interview);
  });

  it('show all interviews', async () => {
    await request(app.getHttpServer())
      .get('/interview')
      .expect(200);
  });

  // it('not authenticated users cannot create new interview')

  it('create new interview', async () => {
    const kozma = users.kozma;
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send({
        username: kozma.email,
        password: '12345',
      });

    const { body: { id } } = await request(app.getHttpServer())
      .post('/interview')
      .set('Cookie', response.header['set-cookie'])
      .send({
        profession: 'Backend PHP Developer',
        position: 'Junior',
      })
      .expect(HttpStatus.FOUND)
      .expect('Location', '/');

    const newInterview = await interviewRepo.findOne(id);

    expect(newInterview).toBeDefined();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
