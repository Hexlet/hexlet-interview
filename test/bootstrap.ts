import * as path from 'path';

export const bootstrap = (app) => {
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  app.setBaseViewsDir(path.join(__dirname,  '..', 'views'));
  app.setViewEngine('pug');
};
