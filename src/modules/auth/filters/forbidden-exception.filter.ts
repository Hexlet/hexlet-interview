import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ForbiddenException,
} from '@nestjs/common';
import * as i18n from 'i18n';

import { Request, Response } from 'express';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request: any = ctx.getRequest<Request>();

    request.session.redirectTo = request.url;
    request.flash('warn', i18n.__('users.form.please_sign_in'));
    response.redirect('/auth/sign_in');
  }
}
