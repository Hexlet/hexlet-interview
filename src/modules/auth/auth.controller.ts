import { Render, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LoginGuard } from '../auth/login.guard';

@Controller('auth')
export class AuthController {

  @Post('/sign_in')
  @UseGuards(LoginGuard)
  login(@Res() res: Response) {
    res.redirect('/');
  }

  @Post('/sign_up')
  register(@Res() res: Response) {
    res.redirect('/');
  }

  @Get('sign_in')
  @Render('auth/sign_in')
  showSignIn() {
    return {};
  }

  @Get('sign_up')
  @Render('auth/sign_up')
  showSignUp() {
    return {};
  }
}
