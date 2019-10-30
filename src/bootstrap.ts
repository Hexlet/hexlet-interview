import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import _ from 'lodash';
import * as dateFns from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
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

const getDateLocale = (locale: string): dateFns.Locale => {
  const mapLocale = {
    ru,
    en: enUS,
  };
  return mapLocale[locale];
};
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
      windowMs: 5 * 60 * 1000,
      max: 100,
    }),
  );

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    res.locals._ = _;
    res.locals.dateFns = dateFns;
    res.locals.dateLocale = getDateLocale(res.locale);
    res.locals.helpers = viewHelpers;
    res.locals.login = req.isAuthenticated();
    res.locals.path = req.path;
    res.locals.user = req.user;
    res.locals.userRole = req.user ? req.user.role : 'guest';
    next();
  });
  app.useStaticAssets(join(__dirname, 'public'), {
    prefix: '/assets/',
  });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
};
