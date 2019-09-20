import { Render, Controller, Get, Post, Res, Req, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginGuard } from '../auth/login.guard';

@Controller('auth')
export class AuthController {

  @Post('/sign_in')
  @UseGuards(LoginGuard)
  signIn(@Req() req: any, @Res() res: Response) {
    const redirectTo = req.session.redirectTo || '/';
    delete req.session.redirectTo;

    res.redirect(redirectTo);
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
