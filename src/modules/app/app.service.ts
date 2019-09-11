import { Injectable } from '@nestjs/common';
import * as i18n from 'i18n';

@Injectable()
export class AppService {
  getHello(locale: string) {
    i18n.setLocale(locale);
    return { message: i18n.__('Hello') };
  }
}
