import * as request from 'supertest';
import { Interview } from '../../src/modules/interview/interview.entity';
import { createTestingApp } from '../app.testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';

describe('#interview', () => {
  let app: INestApplication;
  let interviewRepo: Repository<Interview>;

  beforeEach(async () => {
    app = await createTestingApp();
    interviewRepo = getRepository(Interview);
  });

  it('show all interviews', async () => {
    await request(app.getHttpServer())
      .get('/interview')
      .expect(200);
  });

  it('create new interview in new state', async () => {
    const { body: { id } } = await request(app.getHttpServer())
      .post('/interview')
      .send({
        interviewee: 'Vasya',
        profession: 'Backend PHP Developer',
        position: 'Junior',
      })
      .expect(HttpStatus.FOUND);

    const newInterview = await interviewRepo.findOne(id);

    expect(newInterview).not.toBeNull();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
