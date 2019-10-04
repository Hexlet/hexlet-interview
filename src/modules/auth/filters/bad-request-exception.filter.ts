import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import * as i18n from 'i18n';

import { Request, Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request: any = ctx.getRequest<Request>();

    let errorMessage = '';
    if (exception.message.message[0].constraints) {
      errorMessage = Object.values(
        exception.message.message[0].constraints,
      )[0] as string;
    } else {
      errorMessage = exception.message.message;
    }

    response.status(HttpStatus.BAD_REQUEST);
    request.flash('error', i18n.__(`validation.${errorMessage}`));

    // make sure your view called in accordance with url structure
    return response.render(request.url.replace(/^\/+/, ''), {
      req: request.body,
    });
  }
}
