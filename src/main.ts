import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as i18n from 'i18n';

i18n.configure({
  locales: ['en', 'ru'],
  cookie: 'interviewcookie',
  directory: __dirname + '/locales'
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(i18n.init);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
