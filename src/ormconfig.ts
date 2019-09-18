import { ConfigService } from './modules/config/config.service';

const config = new ConfigService(`${process.env.NODE_ENV}.env`);

export = config.dbParams;
