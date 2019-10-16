import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { User } from '../../src/modules/user/user.entity';
import { Interview } from '../../src/modules/interview/interview.entity';
import { createTestingApp } from '../app.testing';
import { loadFixtures, clearDb } from '../fixtures.loader';

describe('#interview', () => {
  let app: INestApplication;
  let interviewRepo: Repository<Interview>;
  let users: { [key: string]: User };
  let interviews: { [key: string]: Interview };

  const adminAuthInfo = {
    username: 'admin@admin.com',
    password: 'admin',
  };

  const userAuthInfo = {
    username: 'kprutkov@gmail.com',
    password: '12345',
  };

  beforeEach(async () => {
    app = await createTestingApp();
    const fixtures = await loadFixtures();
    users = fixtures.User;
    interviews = fixtures.Interview;
    interviewRepo = getRepository(Interview);
  });

  it('cannot view interviews if not admin', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(userAuthInfo)
      .expect(HttpStatus.FOUND);
    await request(app.getHttpServer())
      .get('/interview/manage/application')
      .set('Cookie', res.header['set-cookie'])
      .expect(HttpStatus.NOT_FOUND);
  });

  it('show all interviews', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(adminAuthInfo)
      .expect(HttpStatus.FOUND)
      .expect('Location', '/');
    await request(app.getHttpServer())
      .get('/interview/manage/application')
      .set('Cookie', res.header['set-cookie'])
      .expect(HttpStatus.OK);
    await request(app.getHttpServer())
      .get('/interview/manage/coming')
      .set('Cookie', res.header['set-cookie'])
      .expect(HttpStatus.OK);
    await request(app.getHttpServer())
      .get('/interview/manage/passed')
      .set('Cookie', res.header['set-cookie'])
      .expect(HttpStatus.OK);
    await request(app.getHttpServer())
      .get('/interview/manage/canceled')
      .set('Cookie', res.header['set-cookie'])
      .expect(HttpStatus.OK);
  });

  it('assign interview', async () => {
    const { admin, interviewer } = users;
    const { application } = interviews;
    const numberOfComingInterviewsBefore = (await interviewRepo.find({ state: 'coming' })).length;
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send({
        username: admin.email,
        password: 'admin',
      });

    await request(app.getHttpServer())
      .get(`/interview/manage/${application.id}/assignment`)
      .set('Cookie', response.header['set-cookie'])
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .post(`/interview/manage/${application.id}/assignment`)
      .set('Cookie', response.header['set-cookie'])
      .send({
        interviewerId: String(interviewer.id),
        date: '2019-11-10 00:00:00',
        videoLink: 'https://youtu.be/YrXJzD2',
      })
      .expect(HttpStatus.FOUND)
      .expect('Location', '/');
    const numberOfComingInterviewsAfter = (await interviewRepo.find({ state: 'coming' })).length;
    expect(numberOfComingInterviewsAfter).toEqual(numberOfComingInterviewsBefore + 1);
  });

  it('assign interview should fail', async () => {
    const { admin } = users;
    const { application } = interviews;
    const numberOfComingInterviewsBefore = (await interviewRepo.find({ state: 'coming' })).length;
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send({
        username: admin.email,
        password: 'admin',
      });

    await request(app.getHttpServer())
      .get(`/interview/manage/4004/assignment`)
      .set('Cookie', response.header['set-cookie'])
      .expect(HttpStatus.NOT_FOUND);

    await request(app.getHttpServer())
      .get(`/interview/manage/${application.id}/assignment`)
      .set('Cookie', response.header['set-cookie'])
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .post(`/interview/manage/${application.id}/assignment`)
      .set('Cookie', response.header['set-cookie'])
      .send({
        interviewerId: '404',
        date: '2019-11-10 00:00:00',
        videoLink: 'https://youtu.be/YrXJzD2',
      })
      .expect(HttpStatus.BAD_REQUEST);
    const numberOfComingInterviewsAfter = (await interviewRepo.find({ state: 'coming' })).length;
    expect(numberOfComingInterviewsAfter).toEqual(numberOfComingInterviewsBefore);
  });

  afterEach(async () => {
    await clearDb();
    await app.close();
  });
});
