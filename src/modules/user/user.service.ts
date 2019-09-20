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

  async findAll() {
    return await this.repo.find();
  }

  findOneByEmail(email: string): Promise<User> {
    return this.repo.findOne({select: ['firstname', 'lastname', 'email', 'password'], where: { email } });
  }

  async create(userCreateDto: UserCreateDto) {
    const newUser =  this.repo.create(userCreateDto);
    if (newUser) {
      this.repo.save(newUser);
      return newUser;
    }
    return null;
  }

  async update(id: number, user: User) {
    this.repo.update(id, user);
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
