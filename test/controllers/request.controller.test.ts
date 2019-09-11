import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app/app.module';
import { bootstrap } from '../bootstrap';
import { Request } from '../../src/modules/request/request.entity';
import { RequestService } from '../../src/modules/request/request.service';

describe('#request', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    bootstrap(app);

    await app.init();
  });

  it('/ (GET)', () => {
    request(app.getHttpServer())
      .get('/')
      .expect(200);
  });

  it('create new request for interview', async () => {
    request(app.getHttpServer())
      .post('/request')
      .expect(201);
  });
});
