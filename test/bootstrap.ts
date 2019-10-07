import { NestExpressApplication } from '@nestjs/platform-express';
import { bootstrapApp } from '../src/bootstrap';

export const bootstrap = (app: NestExpressApplication): void => bootstrapApp(app);
