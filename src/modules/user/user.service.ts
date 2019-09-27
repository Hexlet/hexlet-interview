import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  findOneByEmail(email: string): Promise<User> {
    return this.repo.findOne({
      select: ['id', 'firstname', 'lastname', 'email', 'password', 'verified'],
      where: { email },
    });
  }

  createAndSave(userCreateDto: UserCreateDto): Promise<User> {
    const newUser = this.repo.create(userCreateDto);
    if (newUser) {
      return this.repo.save(newUser);
    }
    return null;
  }

  async update(id: number, user: User) {
    this.repo.update(id, user);
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }

  async findOneByConfirmationToken(
    confirmationToken: string,
  ): Promise<User | undefined> {
    return this.repo.findOne({
      select: ['id', 'email'],
      where: { confirmationToken },
    });
  }

  async verifyUser(user: User): Promise<void> {
    await this.repo.update(user, { verified: true, confirmationToken: null });
    this.logger.log('User with id = ${user.id} successfully verified!');
  }
}
