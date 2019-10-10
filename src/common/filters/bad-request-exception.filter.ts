import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { FormData } from '../utils/form-data';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  constructor(private readonly template: string) {}

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const values = request.body;
    const { message: errors } = exception.message;

    response.status(HttpStatus.BAD_REQUEST);
    if (typeof errors === `string`) {
      request.flash('error', errors);
      response.render(this.template, { formdata: new FormData(values) });
      return;
    }
    response.render(this.template, { formdata: new FormData(values, errors) });
  }
}
