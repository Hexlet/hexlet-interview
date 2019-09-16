import * as request from 'supertest';
import { createTestingApp } from '../app.testing';
import { INestApplication } from '@nestjs/common';
import { Request } from '../../src/modules/request/request.entity';
import { Repository, getRepository } from 'typeorm';
import { RequestCreateDto } from '../../src/modules/request/dto/request.create.dto';

describe('#request', () => {
  let app: INestApplication;
  let requestRepository: Repository<Request>;
  const createRequestBody: RequestCreateDto = {
    username: 'Vasya',
    profession: 'Backend PHP Developer',
    position: 'Junior',
  };

  beforeEach(async () => {
    app = await createTestingApp();
    requestRepository = getRepository(Request);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
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
      .send(createRequestBody)
      .expect(201);

    const newrequest = await requestRepository.findOne(id);
    expect({ ...createRequestBody, id, description: null }).toEqual(newrequest);
  });
});
