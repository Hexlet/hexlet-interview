import { Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
      callbackURL: `${configService.get('HOST')}/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(accessToken, refreshToken, profile): Promise<any> {
    const {
      id,
      displayName,
      username,
      emails: [{ value: email }],
    } = profile;
    const name = displayName || username;
    const user = await this.authService.findOrCreateUserBySocialUid('github', id, { email, name });
    return user;
  }
}
