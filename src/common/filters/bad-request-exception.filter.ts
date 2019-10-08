import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import * as i18n from 'i18n';

import { Request, Response } from 'express';

const buildErrorsObject = (message: [any]): any => {
  if (!message[0].constraints) {
    return {};
  }
  return message.reduce((acc: object, rawError: any) => {
    const { property, constraints } = rawError;
    const errors = Object.entries(constraints).map(([constraintName, defaultErrorMsg]) => {
      const errorMsg = i18n.__(`validation.${defaultErrorMsg}`);
      return { constraintName, errorMsg };
    });
    return { ...acc, [property]: errors };
  }, {});
};

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BadRequestExceptionFilter.name);

  constructor(private readonly template: string) {}

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { message } = exception.message;
    this.logger.log(message);
    const errorsObject = buildErrorsObject(message);
    if (_.isEmpty(errorsObject)) {
      (request as any).flash('error', i18n.__(`validation.${message}`));
    }
    const formdata = {
      values: request.body,
      errors: errorsObject,
    };
    response.status(HttpStatus.BAD_REQUEST);
    response.render(this.template, {
      formdata,
    });
  }
}
