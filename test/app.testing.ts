import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/modules/app/app.module';
import { bootstrap } from './bootstrap';
import { getRepository } from 'typeorm';

import { Request } from '../src/modules/request/request.entity';
import { Interview } from '../src/modules/interview/interview.entity';
import { User } from '../src/modules/user/user.entity';

export const createTestingApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  bootstrap(app);

  await app.init();

  return { ...app, ...{
    http: app.getHttpServer(),
    close: app.close,
    repos: {
      request: getRepository(Request),
        interview: getRepository(Interview),
          user: getRepository(User),
    },
  }};
};
