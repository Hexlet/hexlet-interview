import { Controller, Get, Render, Res, UseGuards, Post, Request, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    ) {}

  @Get()
  @Render('index')
  async getHello(@Res() res: Response, @Req() req: any) {
    const locale = res.getLocale();

    return {
      comingInterviews: [{
        interviewer: 'Vasiliy Ivanov',
        interviewee: 'Petr Sidorov',
        videoLink: 'https://youtube.com',
      }],
      pastInterviews: [{
        interviewer: 'Ivan Ivanov',
        interviewee: 'Petr Petrov',
        videoLink: 'https://youtube.com/',
      }],
      message: this.appService.getHello(locale),
    };
  }
}
