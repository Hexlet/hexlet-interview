import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as i18n from 'i18n';

import { Request, Response } from 'express';

@Injectable()
@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AuthExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(JSON.stringify(exception.message));
    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
    ) {
      (request as any).flash('error', i18n.__('users.login_error'));
    }
    response.status(exception.getStatus()).redirect('/');
  }
}
