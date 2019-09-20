import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    let result;
    try {
      result = (await super.canActivate(context)) as boolean;
    } catch (e) {
      return true;
      // throw e;
    }
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}
