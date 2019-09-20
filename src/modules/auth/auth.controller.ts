import { Render, Controller, Get, Post, Res, Req, UseGuards, Body, HttpStatus, UseFilters, ForbiddenException, UnprocessableEntityException } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginGuard } from '../auth/login.guard';
import { UserService } from '../user/user.service';
import { UserCreateDto } from '../user/dto/user.create.dto';
import { Logger } from '@nestjs/common';
import { AuthExceptionFilter } from '../../common/filters/auth-exceptions.filter';
import * as i18n from 'i18n';

@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(public userService: UserService) {

  }

  @Post('/sign_in')
  @UseGuards(LoginGuard)
  signIn(@Req() req: Request, @Res() res: Response) {
    (req as any).flash('success', i18n.__('users.login_success'));
    res.redirect('/');
  }

  @Post('/sign_up')
  async signUp(@Req() req: Request, @Body() userDto: UserCreateDto, @Res() res: Response) {
    if (userDto.password !== userDto.confirmpassword) {
      this.logger.error('Password and password confirmation did not match.');
      const errMessage = i18n.__('users.registration_error_password_mismatch');
      (req as any).flash('error', errMessage);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ error: errMessage });
      return;
    }

    if (await this.userService.findOneByEmail(userDto.email)) {
      this.logger.error(`Try to register existing user ${userDto.email}`);
      const errMessage = i18n.__('users.registration_error_existing_user');
      (req as any).flash('error', errMessage);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ error: errMessage });
      return;
    }

    const newUser = await this.userService.createAndSave(userDto);
    (req as any).flash('success', i18n.__('users.registration_success'));
    res.status(HttpStatus.CREATED).json({ user: newUser });
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
