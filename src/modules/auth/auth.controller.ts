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
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginGuard } from './guards';
import { UserService } from '../user/user.service';
import { UserCreateDto } from '../user/dto/user.create.dto';
import * as i18n from 'i18n';

@Controller('auth')
export class AuthController {
  constructor(public userService: UserService) {}

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

    await this.userService.createAndSave({ ...userDto, ...{ role: 'user' } });
    (req as any).flash('success', i18n.__('users.form.registration_success'));
    return res.redirect('/auth/sign_in');
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
