import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './request.entity';
import { Repository } from 'typeorm';

export class RequestService {
  constructor(
    @InjectRepository(Request) private readonly repo: Repository<Request>,
  ) {}

  async findAll() {
    return await this.repo.find();
  }

  async findOne() {
    return await this.repo.findOne();
  }

  async create() {
    return this.repo.create();
  }

  // async update() {
  //   return this.repo.update();
  // }
}
