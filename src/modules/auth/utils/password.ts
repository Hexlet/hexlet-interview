import * as bcrypt from 'bcrypt';
import { User } from '../../user/user.entity';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(user: User, password: string ) {
  return await bcrypt.compare(password, user.password);
}
