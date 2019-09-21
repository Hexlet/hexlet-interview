import { ValidationPipe } from '@nestjs/common';
import { UnauthorizedExceptionFilter, ForbiddenExceptionFilter, BadRequestExceptionFilter } from './modules/auth/filters';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as i18n from 'i18n';
import * as Session from 'express-session';
import * as passport from 'passport';
import * as flash from 'express-flash';

i18n.configure({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  directory: __dirname + '/../locales',
  objectNotation: true,
  updateFiles: false,
});

export const bootstrapApp = (app: NestExpressApplication) => {
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.useGlobalFilters(new ForbiddenExceptionFilter());
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.use(i18n.init);
  app.use((req, res, next) => {
    res.setLocale('ru');
    next();
  });

  app.use(Session({
    cookie: {
      maxAge: 86400000,
      secure: false,
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    res.locals.login = req.isAuthenticated();
    next();
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
};
