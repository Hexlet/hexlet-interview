import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

export const bootstrapApp = (app) => {
  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
};
