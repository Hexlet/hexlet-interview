import { createParamDecorator } from '@nestjs/common';

export const ReqUser = createParamDecorator((_data, req) => {
  return req.user;
});
