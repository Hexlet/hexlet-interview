import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GitHubUnauthorizedException } from '../../../utils/custom-errors';

@Injectable()
export class GithubGuard extends AuthGuard('github') {
  private readonly logger = new Logger(GithubGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = (await super.canActivate(context)) as boolean;
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
      return result;
    } catch (err) {
      this.logger.log(err.message);
      throw new GitHubUnauthorizedException();
    }
  }
}
