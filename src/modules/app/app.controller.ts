import { Controller, Get, Render, Res, UseGuards, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { LoginGuard } from '../auth/login.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { UserService } from '../user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    ) {}

    @UseGuards(LoginGuard)
    @Post('/login')
    login(@Res() res: Response) {
      res.redirect('/index');
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/user')
    @Render('views/user/index')
    getUsers(@Request() req) {
      return { users: ['One', 'Two', 'Three'] };
    }

  @Get()
  @Render('index')
  async getHello(@Res() res: Response) {
    const locale = res.getLocale();
    return { message: this.appService.getHello(locale) };
  }
}
