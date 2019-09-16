import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('sign_in')
  @Render('user/sign_in')
  showSignIn() {
    return {};
  }

  @Get('sign_up')
  @Render('user/sign_up')
  showSignUp() {
    return {};
  }
}
