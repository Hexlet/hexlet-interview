import * as request from 'supertest';
import { createTestingApp, TestingApp } from '../app.testing';
import { HttpStatus } from '@nestjs/common';

describe('#request', () => {
  let app: TestingApp;

  beforeEach(async () => {
    app = await createTestingApp();
  });

  it('show all requests', () => {
    return request(app.http)
      .get('/')
      .expect(200);
  });

  it('create new request for interview', async () => {
    const { body: { id } } = await request(app.http)
      .post('/request')
      .send({ username: 'Vasya', profession: 'Backend PHP Developer', position: 'Junior' })
      .expect(HttpStatus.FOUND);

    const newrequest = await app.repos.request.findOne(id);

    expect(newrequest).not.toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
