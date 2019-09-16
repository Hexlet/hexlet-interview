import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (user && user.comparePassword(pass)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
