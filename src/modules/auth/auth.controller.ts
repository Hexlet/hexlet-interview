import { Render, Controller, Get, Post, Res, Req, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginGuard } from '../auth/login.guard';

@Controller('auth')
export class AuthController {

  @Post('/sign_in')
  @UseGuards(LoginGuard)
  sign_in(@Res() res: Response) {
    res.redirect('/');
  }

  @Post('/sign_up')
  sign_up(@Req() req: Request, @Res() res: Response) {
    res.locals.loggedIn = (req.user) ? true : false;
    res.redirect('/');
  }

  @Get('sign_out')
  sign_out(@Req() req: Request, @Res() res: Response) {
    req.logout();
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
