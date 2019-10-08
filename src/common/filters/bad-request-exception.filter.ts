import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import * as i18n from 'i18n';

import { Request, Response } from 'express';

const buildErrorsObject = (message: [any]): any | false => {
  if (!message[0].constraints) {
    return false;
  }
  return message.reduce((acc: object, error: any) => {
    const { property, constraints: rawConstraints } = error;
    const constraints = Object.entries(rawConstraints).map(([constraintName, defaultErrorMsg]) => {
      const errorMsg = i18n.__(`validation.${defaultErrorMsg}`);
      return { constraintName, errorMsg };
    });
    return { ...acc, [property]: constraints };
  }, {});
};

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BadRequestExceptionFilter.name);

  constructor(
    private readonly parameters: {
      template: string;
    },
  ) {}

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { template } = this.parameters;
    const { message } = exception.message;
    this.logger.log(message);
    const errorsObject = buildErrorsObject(message);
    if (!errorsObject) {
      (request as any).flash('error', i18n.__(`validation.${message}`));
    }
    const formdata = {
      values: request.body,
      errors: errorsObject,
    };
    response.status(HttpStatus.BAD_REQUEST);
    response.render(template, {
      formdata,
    });
  }
}
