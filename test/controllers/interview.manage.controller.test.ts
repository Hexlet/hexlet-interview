import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { User } from '../../src/modules/user/user.entity';
import { Interview, interviewState } from '../../src/modules/interview/interview.entity';
import { createTestingApp } from '../app.testing';
import { loadFixtures, clearDb } from '../fixtures.loader';

describe('manage interview', () => {
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

  describe('get interviews', () => {
    let cookie: string;

    beforeEach(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/sign_in')
        .send(adminAuthInfo)
        .expect(HttpStatus.FOUND)
        .expect('Location', '/');
      cookie = res.header['set-cookie'];
    });

    it('applications', () => {
      return request(app.getHttpServer())
        .get('/interview/manage/application')
        .set('Cookie', cookie)
        .expect(HttpStatus.OK);
    });

    it('applications', () => {
      return request(app.getHttpServer())
        .get('/interview/manage/coming')
        .set('Cookie', cookie)
        .expect(HttpStatus.OK);
    });

    it('passed', () => {
      return request(app.getHttpServer())
        .get('/interview/manage/passed')
        .set('Cookie', cookie)
        .expect(HttpStatus.OK);
    });

    it('cancelled', () => {
      return request(app.getHttpServer())
        .get('/interview/manage/cancelled')
        .set('Cookie', cookie)
        .expect(HttpStatus.OK);
    });

    it('only admin can get interviews', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/sign_in')
        .send(userAuthInfo)
        .expect(HttpStatus.FOUND);
      await request(app.getHttpServer())
        .get('/interview/manage/application')
        .set('Cookie', res.header['set-cookie'])
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  it('success interview assignment', async () => {
    const { admin, interviewer } = users;
    const { application } = interviews;
    const numberOfComingInterviewsBefore = (await interviewRepo.find({ state: interviewState.COMING })).length;
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

    //await request(app.getHttpServer())
      //.post(`/interview/manage/${application.id}/assignment`)
      //.set('Cookie', response.header['set-cookie'])
      //.send({
        //interviewerId: String(interviewer.id),
        //date: '2019-11-10 00:00:00',
        //videoLink: 'https://youtu.be/YrXJzD2',
      //})
      //.expect(HttpStatus.FOUND)
      //.expect('Location', '/interview/manage/application');

    //const numberOfComingInterviewsAfter = (await interviewRepo.find({ state: interviewState.COMING })).length;
    //expect(numberOfComingInterviewsAfter).toEqual(numberOfComingInterviewsBefore + 1);
  });

  it('attempt to assign unexciting interview', async () => {
    const { admin } = users;
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
  });

  it('attempt to assign interview to unexciting interviewer', async () => {
    const { admin } = users;
    const { application } = interviews;
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
        interviewerId: '404',
        date: '2019-11-13 22:43:12',
        videoLink: 'https://youtu.be/YrXJzD2',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('create new interview', async () => {
    const { admin, kozma, interviewer } = users;
    const newInterviewData = {
      profession: 'php',
      position: 'junior',
      interviewerId: interviewer.id,
      intervieweeId: kozma.id,
      date: '2019-11-10 12:00:00',
      videoLink: 'https://youtu.be/YrXJzD2',
      state: interviewState.COMING,
    };
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send({
        username: admin.email,
        password: 'admin',
      });

    await request(app.getHttpServer())
      .get(`/interview/manage/new`)
      .set('Cookie', response.header['set-cookie'])
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .post(`/interview/manage/new`)
      .set('Cookie', response.header['set-cookie'])
      .send(newInterviewData)
      .expect(HttpStatus.FOUND);

    expect(await interviewRepo.find(newInterviewData)).toHaveLength(1);
  });

  it('update interview', async () => {
    const { admin } = users;
    const { coming } = interviews;

    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send({
        username: admin.email,
        password: 'admin',
      });

    await request(app.getHttpServer())
      .get(`/interview/manage/${coming.id}/edit`)
      .set('Cookie', response.header['set-cookie'])
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .post(`/interview/manage/${coming.id}/edit`)
      .set('Cookie', response.header['set-cookie'])
      .send({
        ...coming,
        intervieweeId: coming.interviewee.id,
        interviewerId: coming.interviewer!.id,
        profession: 'PHP',
      })
      .expect(HttpStatus.FOUND);

    const updatetedInterwiew = await interviewRepo.findOne(coming.id);
    expect(updatetedInterwiew!.profession).toBe('PHP');
  });

  afterEach(async () => {
    await clearDb();
    await app.close();
  });
});
