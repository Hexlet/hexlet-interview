import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import _ from 'lodash';
import i18n from 'i18n';
import Session from 'express-session';
import passport from 'passport';
import flash from 'express-flash';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {
  UnauthorizedExceptionFilter,
  ForbiddenExceptionFilter,
  GitHubUnauthorizedExceptionFilter,
  NotFoundExceptionFilter,
} from './common/filters';
import viewHelpers from './common/utils/view.helpers';

i18n.configure({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  directory: `${__dirname}/../locales`,
  objectNotation: true,
  updateFiles: false,
});

export const bootstrapApp = (app: NestExpressApplication): void => {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalFilters(new ForbiddenExceptionFilter());
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.useGlobalFilters(new GitHubUnauthorizedExceptionFilter());
  app.use(i18n.init);
  app.use((_req, res, next) => {
    res.setLocale('ru');
    next();
  });

  app.use(
    Session({
      cookie: {
        maxAge: 86400000,
        secure: false,
      },
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(helmet());
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    res.locals._ = _;
    res.locals.helpers = viewHelpers;
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    res.locals.userRole = req.user ? req.user.role : 'guest';
    next();
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
};
