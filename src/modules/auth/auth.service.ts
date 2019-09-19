import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { comparePassword } from './utils/password';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UserService,
    ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (!user) {
      this.logger.log('user ${email}  not found!');
      return null;
    }

    if (!comparePassword(user, pass)) {
      this.logger.log('user found, password mismatch!');
      return null;
    }

    const { password, ...result } = user;
    this.logger.log('user found, authentificated');
    return result;
}
}
