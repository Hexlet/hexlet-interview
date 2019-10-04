import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { comparePassword } from '../../common/utils/password';

function sanitizeUser(user: User) {
  const { password, githubUid, ...result } = user;
  return result;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly usersService: UserService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (!user) {
      this.logger.log(`user ${email}  not found!`);
      return null;
    }
    if (!(await comparePassword(user, pass))) {
      this.logger.log('user found, password mismatch!');
      return null;
    }
    if (!user.verified) {
      this.logger.log('user still not verified by email!');
      return null;
    }

    this.logger.log('user found, authentificated');
    return sanitizeUser(user);
  }

  async findOrCreateUserBySocialUid(
    provider: string,
    uid: string,
    info: {
      email: string;
      name: string;
    },
  ): Promise<any> {
    const { email, name } = info;
    const userBySocialUid: User = await this.usersService.findOneBySocialUid(
      provider,
      uid,
    );
    if (userBySocialUid) {
      this.logger.log(`user found by ${provider} uid`);
      return sanitizeUser(userBySocialUid);
    }
    const userByEmail: User = await this.usersService.findOneByEmail(email);
    if (userByEmail) {
      await this.usersService.addSocialUid(userByEmail, provider, uid);
      this.logger.log(`user found by ${email}, uid saved to user account`);
      return sanitizeUser(userByEmail);
    }
    const newUser = await this.usersService.createAndSave({
      email,
      firstname: name,
      ...{ role: 'user' },
      [`${provider}Uid`]: uid,
    });
    this.logger.log(`new user created by ${provider} profile`);
    return sanitizeUser(newUser);
  }
}
