import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import * as i18n from 'i18n';

import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request: any = ctx.getRequest<Request>();

    response.status(HttpStatus.UNAUTHORIZED);
    request.flash('error', i18n.__('users.form.invalid_credentials'));
    return response.render('auth/sign_in', { req: request.body });
  }
}
