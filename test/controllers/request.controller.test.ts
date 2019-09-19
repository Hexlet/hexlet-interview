import * as request from 'supertest';
import { Request } from '../../src/modules/request/request.entity';
import { createTestingApp } from '../app.testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';

describe('#request', () => {
  let app: INestApplication;
  let requestRepo: Repository<Request>;

  beforeEach(async () => {
    app = await createTestingApp();
    requestRepo = getRepository(Request);
  });

  it('show all requests', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200);
  });

  it('create new request for interview', async () => {
    const {
      body: { id },
    } = await request(app.getHttpServer())
      .post('/request')
      .send({
        username: 'Vasya',
        profession: 'Backend PHP Developer',
        position: 'Junior',
      })
      .expect(HttpStatus.FOUND);

    const newrequest = await requestRepo.findOne(id);

    expect(newrequest).not.toBeNull();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
