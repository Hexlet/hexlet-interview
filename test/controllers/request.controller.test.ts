import * as request from 'supertest';
import { createTestingApp } from '../app.testing';

describe('#request', () => {
  let app;

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
      .expect(302);

    const newrequest = await app.repos.request.findOne(id);

    expect(newrequest).not.toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
