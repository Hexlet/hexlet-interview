import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  findOneByEmail(email: string): Promise<User> {
    return this.repo.findOne({
      select: ['id', 'firstname', 'lastname', 'email', 'password'],
      where: { email },
    });
  }

  findOneBySocialUid(provider: string, uid: string): Promise<User> {
    return this.repo.findOne(
      {
        select: ['id', 'firstname', 'lastname', 'email', 'password'],
        where: { [`${provider}Uid`]: uid },
      },
    );
  }

  createAndSave(userCreateDto: UserCreateDto): Promise<User> {
    const newUser = this.repo.create(userCreateDto);
    if (newUser) {
      return this.repo.save(newUser);
    }
    return null;
  }

  addSocialUid(user: User, provider: string, uid: string) {
    return this.repo.update(user.id, { [`${provider}Uid`]: uid });
  }

  async update(id: number, user: User) {
    this.repo.update(id, user);
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
