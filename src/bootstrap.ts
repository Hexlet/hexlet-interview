import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as i18n from 'i18n';
import * as Session from 'express-session';
import * as passport from 'passport';

i18n.configure({
  locales: ['en', 'ru'],
  cookie: 'interviewcookie',
  directory: __dirname + '/locales',
  objectNotation: true,
});

export const bootstrapApp = (app: NestExpressApplication) => {
  app.useGlobalPipes(new ValidationPipe());
  app.use(i18n.init);

  app.use(Session({
    cookie: {
      maxAge: 86400000,
      secure: false,
    },
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
};
