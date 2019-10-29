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
  let interview: { [key: string]: Interview };

  beforeEach(async () => {
    app = await createTestingApp();
    const fixtures = await loadFixtures();
    users = fixtures.User;
    interview = fixtures.Interview;
    userRepo = getRepository(User);
    interviewRepo = getRepository(Interview);
  });

  it('create new interview application', async () => {
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
      .post('/interview/application')
      .set('Cookie', response.header['set-cookie'])
      .send({
        profession: 'Backend PHP Developer',
        position: 'Junior',
        description: "I'm definitely good developer",
      })
      .expect(HttpStatus.FOUND)
      .expect('Location', '/my/application');

    const reloadedUser = await userRepo.findOne(kozma.id, {
      relations: ['interviews'],
    });

    expect(reloadedUser!.interviews.length).toEqual(numberOfInterviewsBefore + 1);
  });

  it('edit interview application', async () => {
    const { kozma } = users;
    const { application } = interview;
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send({
        username: kozma.email,
        password: '12345',
      });
    const cookie = response.header['set-cookie'];

    const updatedInterviewData = {
      profession: 'PHP',
      position: 'intern',
      description: "I'll do my best.",
    };
    await request(app.getHttpServer())
      .get('/auth/sign_in')
      .send({
        username: kozma.email,
        password: '12345',
      })
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .post(`/interview/application/${application.id}/edit`)
      .set('Cookie', cookie)
      .send(updatedInterviewData)
      .expect(HttpStatus.FOUND)
      .expect('Location', '/my/application');

    const updatedInterview = await interviewRepo.findOne(application.id);
    expect(updatedInterview!.description).toBe(updatedInterviewData.description);
  });

  it('user can edit only own interview', async () => {
    const { kozma } = users;
    const { application2 } = interview;
    const response = await request(app.getHttpServer())
      .post('/auth/sign_in')
      .send({
        username: kozma.email,
        password: '12345',
      });
    const cookie = response.header['set-cookie'];

    const updatedInterviewData = {
      profession: 'PHP',
      position: 'intern',
      description: "I'll do my best.",
    };

    await request(app.getHttpServer())
      .get(`/interview/application/${application2.id}/edit`)
      .set('Cookie', cookie)
      .send(updatedInterviewData)
      .expect(HttpStatus.NOT_FOUND);

    await request(app.getHttpServer())
      .post(`/interview/application/${application2.id}/edit`)
      .set('Cookie', cookie)
      .send(updatedInterviewData)
      .expect(HttpStatus.BAD_REQUEST);
  });

  afterEach(async () => {
    await clearDb();
    await app.close();
  });
});
