import {
  Render,
  Controller,
  Get,
  Post,
  Res,
  Req,
  UseGuards,
  Body,
  BadRequestException,
  NotFoundException,
  Redirect,
  Param,
} from '@nestjs/common';
import { Response, Request } from 'express';
import * as i18n from 'i18n';
import { LoginGuard, GithubGuard } from './guards';
import { UserService } from '../user/user.service';
import { UserCreateDto } from '../user/dto/user.create.dto';
import { MailerService } from '../mailer/mailer.service';

@Controller('auth')
export class AuthController {
  constructor(
    public userService: UserService,
    public mailerService: MailerService,
  ) {}

  @Post('/sign_in')
  @UseGuards(LoginGuard)
  signIn(@Req() req: any, @Res() res: Response) {
    const redirectTo = req.session.redirectTo || '/';
    delete req.session.redirectTo;

    res.redirect(redirectTo);
  }

  @Post('/sign_up')
  async signUp(
    @Req() req: Request,
    @Body() userDto: UserCreateDto,
    @Res() res: Response,
  ) {
    if (userDto.password !== userDto.confirmpassword) {
      throw new BadRequestException('registration_error_password_mismatch');
    }

    if (await this.userService.findOneByEmail(userDto.email)) {
      throw new BadRequestException('registration_error_existing_user');
    }

    const user = await this.userService.createAndSave({
      ...userDto,
      ...{ role: 'user' },
    });

    const link = `${req.get('host')}/auth/verify/${user.confirmationToken}`;
    await this.mailerService.sendVerifyLink(user.email, link);

    (req as any).flash('success', i18n.__('users.form.need_mail_confirm'));
    return res.redirect('/');
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

  @Redirect('/auth/sign_in')
  @Get('verify/:token')
  async verifyToken(@Req() req: Request, @Param('token') token: string) {
    const user = await this.userService.findOneByConfirmationToken(token);
    if (!user) {
      throw new NotFoundException();
    }

    await this.userService.verify(user);
    (req as any).flash('success', i18n.__('users.form.registration_success'));
  }

  @Get('github')
  @UseGuards(GithubGuard)
  initGitHubLogin() {
    return {};
  }

  @Get('github/callback')
  @UseGuards(GithubGuard)
  gitHubLoginCb(@Req() req: any, @Res() res: Response) {
    req.flash('success', i18n.__('users.form.login_success'));
    const redirectTo = req.session.redirectTo || '/';
    delete req.session.redirectTo;
    res.redirect(redirectTo);
  }
}
