import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    NotFoundException,
    HttpStatus,
  } from '@nestjs/common';

import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.NOT_FOUND);
    response.render('error/404');
  }
}
