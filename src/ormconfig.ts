import { ConfigService } from './modules/config/config.service';

const filePath = process.env.NODE_ENV === 'production' ? undefined : `${process.env.NODE_ENV}.env`;
const config = new ConfigService(filePath);

export = config.dbParams;
