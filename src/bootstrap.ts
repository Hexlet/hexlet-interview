import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as i18n from 'i18n';

i18n.configure({
  locales: ['en', 'ru'],
  cookie: 'interviewcookie',
  directory: __dirname + '/locales',
});

export const bootstrapApp = (app: NestExpressApplication) => {
  app.useGlobalPipes(new ValidationPipe());
  app.use(i18n.init);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
};