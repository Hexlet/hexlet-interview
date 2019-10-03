import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/modules/app/app.module';
import { bootstrap } from './bootstrap';
import { MailerService } from '../src/modules/mailer/mailer.service';
import { mailerServiceMock } from './mocks/mailer.mock';

export const createTestingApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MailerService)
    .useValue(mailerServiceMock)
    .compile();

  const app = moduleFixture.createNestApplication();
  bootstrap(app);

  await app.init();

  return app;
};
