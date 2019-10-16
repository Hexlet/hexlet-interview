import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { User } from '../../src/modules/user/user.entity';
import { createTestingApp } from '../app.testing';
import { loadFixtures, clearDb } from '../fixtures.loader';

describe('#interview', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let users: { [key: string]: User };

  beforeEach(async () => {
    app = await createTestingApp();
    const fixtures = await loadFixtures();
    users = fixtures.User;
    userRepo = getRepository(User);
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

  afterEach(async () => {
    await clearDb();
    await app.close();
  });
});
