import { Render, Controller, Get, Post, Res, Req, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginGuard } from '../auth/login.guard';
import * as i18n from 'i18n';
import { HttpStatus } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  @Post('/sign_in')
  @UseGuards(LoginGuard)
  signIn(@Req() req: any, @Res() res: Response) {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED);
      req.flash('error', i18n.__('app.title'));
      return res.render('auth/sign_in', { req: req.body });
    }
    res.redirect('/');
  }

  @Post('/sign_up')
  signUp(@Req() req: Request, @Res() res: Response) {
    res.locals.loggedIn = (req.user) ? true : false;
    res.redirect('/');
  }

  @Get('sign_out')
  signOut(@Req() req: Request, @Res() res: Response) {
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
