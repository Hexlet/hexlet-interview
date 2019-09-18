import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { comparePassword } from './utils/password';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (user && comparePassword(user, pass)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
