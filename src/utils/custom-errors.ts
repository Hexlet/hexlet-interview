import { UnauthorizedException } from '@nestjs/common';

export class GitHubUnauthorizedException extends UnauthorizedException {
  constructor(message?: string) {
    super(message);
  }
}
