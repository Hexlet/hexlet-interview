import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Interview } from './entity/interview.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async getHello() {
    return this.appService.getHello();
  }
}
