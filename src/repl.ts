import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import repl from 'repl';
import { AppModule } from './modules/app/app.module';
import { bootstrapApp } from './bootstrap';

/* eslint-disable */
import { Interview } from './modules/interview/interview.entity';
/* eslint-enable */

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await bootstrapApp(app);

  return app;
}

bootstrap().then((app: NestExpressApplication) => {
  const replServer = repl.start('blackbox#> ');

  replServer.context.app = app;
  replServer.context.Interview = Interview;
});
