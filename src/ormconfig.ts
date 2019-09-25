import { ConfigService } from './modules/config/config.service';

const config = new ConfigService();
export = config.dbParams;
