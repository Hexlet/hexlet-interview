import bcrypt from 'bcrypt';
import { User } from '../../modules/user/user.entity';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password);
}
