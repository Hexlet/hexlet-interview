import { ConfigService } from './config.service';

export = new ConfigService(`${process.env.NODE_ENV}.env`).dbParams;
