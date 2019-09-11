import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
<<<<<<< HEAD
import { bootstrapApp } from './bootstrap';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await bootstrapApp(app);
=======
import { join } from 'path';
import * as i18n from 'i18n';
import { ValidationPipe } from '@nestjs/common';

i18n.configure({
  locales: ['en', 'ru'],
  cookie: 'interviewcookie',
  directory: __dirname + '/locales'
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');

>>>>>>> d463a8f80d53a6685207ec27cef7442f92379f77
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
