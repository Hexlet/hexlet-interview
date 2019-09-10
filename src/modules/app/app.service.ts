import { Injectable } from '@nestjs/common';
import { I18nLang, I18nService } from 'nestjs-i18n';

@Injectable()
export class AppService {
  constructor(private readonly i18n: I18nService) {}

  getHello(@I18nLang() lang: string) {
    return { message: this.i18n.translate('sample.HELLO_MESSAGE', { lang }) };
  }
}
