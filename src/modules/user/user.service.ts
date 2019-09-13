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

  async findOne(id: number) {
    return await this.repo.findOne(id);
  }

  async create(userCreateDto: UserCreateDto) {
    return this.repo.create(userCreateDto);
  }

  async update(id: number, user: User) {
    this.repo.update(id, user);
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}
