import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { User } from '../../src/modules/user/user.entity';
import { Interview } from '../../src/modules/interview/interview.entity';
import { createTestingApp } from '../app.testing';
import { loadFixtures, clearDb } from '../fixtures.loader';

describe('#interview', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
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
    userRepo = getRepository(User);
    interviewRepo = getRepository(Interview);
  });

  it('cannot view interviews if not admin', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(userAuthInfo)
      .expect(HttpStatus.FOUND)
      .then(res => {
        return request(app.getHttpServer())
          .get('/interview')
          .set('Cookie', res.header['set-cookie'])
          .expect(HttpStatus.NOT_FOUND);
      });
  });

  it('show all interviews', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign_in')
      .send(adminAuthInfo)
      .expect(HttpStatus.FOUND)
      .expect('Location', '/')
      .then(res => {
        return request(app.getHttpServer())
          .get('/interview')
          .set('Cookie', res.header['set-cookie'])
          .expect(HttpStatus.OK);
      });
  });

  it('create new interview', async () => {
    const { kozma } = users;
    const numberOfInterviewsBefore = (await userRepo.findOne(kozma.id, {
      relations: ['interviews'],
    }))!.interviews.length;
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send({
        username: kozma.email,
        password: '12345',
      });

    await request(app.getHttpServer())
      .post('/interview')
      .set('Cookie', response.header['set-cookie'])
      .send({
        profession: 'Backend PHP Developer',
        position: 'Junior',
        description: "I'm definitely good developer",
      })
      .expect(HttpStatus.FOUND)
      .expect('Location', '/');

    const reloadedUser = await userRepo.findOne(kozma.id, {
      relations: ['interviews'],
    });

    expect(reloadedUser!.interviews.length).toEqual(numberOfInterviewsBefore + 1);
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
      .get(`/interview/${application.id}/assignment`)
      .set('Cookie', response.header['set-cookie'])
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/interview/4004/assignment`)
      .set('Cookie', response.header['set-cookie'])
      .expect(HttpStatus.NOT_FOUND);

    await request(app.getHttpServer())
      .post(`/interview/${application.id}/assignment`)
      .set('Cookie', response.header['set-cookie'])
      .send({
        interviewer: interviewer.id,
        date: '2019-11-10 00:00:00',
        videoLink: 'https://youtu.be/YrXJzD2',
      })
      .expect(HttpStatus.FOUND)
      .expect('Location', '/');
    const numberOfComingInterviewsAfter = (await interviewRepo.find({ state: 'coming' })).length;
    expect(numberOfComingInterviewsAfter).toEqual(numberOfComingInterviewsBefore + 1);
  });

  afterEach(async () => {
    await clearDb();
    await app.close();
  });
});
