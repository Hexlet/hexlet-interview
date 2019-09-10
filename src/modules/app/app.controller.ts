import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { I18nLang } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async getHello(@I18nLang() lang: string) {
    return this.appService.getHello(lang);
  }
}
