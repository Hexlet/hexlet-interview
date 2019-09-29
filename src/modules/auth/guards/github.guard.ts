import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GitHubUnauthorizedException } from '../../../utils/custom-errors';
import { Logger } from '@nestjs/common';

@Injectable()
export class GithubGuard extends AuthGuard('github') {
  async canActivate(context: ExecutionContext) {
    try {
      const result = (await super.canActivate(context)) as boolean;
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
      return result;
    } catch (err) {
      Logger.error('Error happened during guthub auth', GithubGuard.name);
      throw new GitHubUnauthorizedException();
    }
  }
}
