import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as mockTransport from 'nodemailer-mock-transport';
import { createTransport } from 'nodemailer';
import { AppModule } from '../src/modules/app/app.module';
import { bootstrap } from './bootstrap';
import { MailerService } from '../src/modules/mailer/mailer.service';
import { ConfigService } from '../src/modules/config/config.service';

const mockMailTransport = mockTransport();
export const createTestingApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MailerService)
    .useFactory({
      factory: (configService: ConfigService) => {
        return new MailerService(createTransport(mockMailTransport), configService);
      },
      inject: [ConfigService],
    })
    .compile();

  const app = moduleFixture.createNestApplication();
  bootstrap(app);

  await app.init();

  return app;
};

export const mailStub: { sentMail: { data: any }[] } = mockMailTransport;
