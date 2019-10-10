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
  UseFilters,
} from '@nestjs/common';
import { Response, Request } from 'express';
import i18n from 'i18n';
import { LoginGuard, GithubGuard } from '../../common/guards';
import { UserService } from '../user/user.service';
import { UserCreateDto } from '../user/dto/user.create.dto';
import { MailerService } from '../mailer/mailer.service';
import { BadRequestExceptionFilter } from '../../common/filters/bad-request-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(public userService: UserService, public mailerService: MailerService) {}

  @Post('/sign_in')
  @UseGuards(LoginGuard)
  signIn(@Req() req: Request, @Res() res: Response): void {
    const storedRedirect = req.session && req.session.redirectTo;
    const redirectTo = storedRedirect || '/';
    delete req.session!.redirectTo;
    res.redirect(redirectTo);
  }

  @Post('/sign_up')
  @UseFilters(new BadRequestExceptionFilter('auth/sign_up'))
  async signUp(@Req() req: Request, @Body() userDto: UserCreateDto, @Res() res: Response): Promise<void> {
    if (userDto.password !== userDto.confirmpassword) {
      throw new BadRequestException(i18n.__('validation.registration_error_password_mismatch'));
    }

    if (await this.userService.findOneByEmail(userDto.email)) {
      throw new BadRequestException(i18n.__('validation.registration_error_existing_user'));
    }

    const user = await this.userService.createAndSave({
      ...userDto,
      ...{ role: 'user' },
    });

    const link = `${req.protocol}://${req.get('host')}/auth/verify/${user.confirmationToken}`;
    await this.mailerService.sendVerifyLink(user.email, link);

    req.flash('success', i18n.__('users.form.need_mail_confirm'));
    return res.redirect('/');
  }

  @Get('sign_out')
  signOut(@Req() req: Request, @Res() res: Response): void {
    req.logout();
    res.redirect('/');
  }

  @Get('sign_in')
  @Render('auth/sign_in')
  showSignIn(): {} {
    return {};
  }

  @Get('sign_up')
  @Render('auth/sign_up')
  showSignUp(): {} {
    return {};
  }

  @Redirect('/auth/sign_in')
  @Get('verify/:token')
  async verifyToken(@Req() req: Request, @Param('token') token: string): Promise<void> {
    const user = await this.userService.findOneByConfirmationToken(token);
    if (!user) {
      throw new NotFoundException();
    }

    await this.userService.verify(user);
    req.flash('success', i18n.__('users.form.registration_success'));
  }

  @Get('github')
  @UseGuards(GithubGuard)
  initGitHubLogin(): {} {
    return {};
  }

  @Get('github/callback')
  @UseGuards(GithubGuard)
  gitHubLoginCb(@Req() req: Request, @Res() res: Response): void {
    req.flash('success', i18n.__('users.form.login_success'));
    const redirectTo = req.session!.redirectTo || '/';
    delete req.session!.redirectTo;
    res.redirect(redirectTo);
  }
}
