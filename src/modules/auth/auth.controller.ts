import { Render, Controller, Get, Post, Res, Req, UseGuards, Body, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginGuard } from '../auth/login.guard';
import { UserService } from '../user/user.service';
import { UserCreateDto } from '../user/dto/user.create.dto';
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(public userService: UserService) {

  }

  @Post('/sign_in')
  @UseGuards(LoginGuard)
  signIn(@Res() res: Response) {
    res.redirect('/');
  }

  @Post('/sign_up')
  async signUp(@Body() userDto: UserCreateDto, @Res() res: Response) {
    if (userDto.password !== userDto.confirmpassword) {
      this.logger.log('Error: password and password confirmation did not match.');
      res.redirect(HttpStatus.UNPROCESSABLE_ENTITY, '/');
      return;
    }

    if (await this.userService.findOneByEmail(userDto.email)) {
      this.logger.log(`Error: try to register existing user ${userDto.email}`);
      res.redirect(HttpStatus.UNPROCESSABLE_ENTITY, '/');
      return;
    }

    await this.userService.createAndSave(userDto);
    res.redirect(HttpStatus.CREATED, '/');
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
