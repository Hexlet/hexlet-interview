import * as bcrypt from 'bcrypt';
import { User } from '../../modules/user/user.entity';

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(user: User, password: string) {
  return bcrypt.compare(password, user.password);
}
