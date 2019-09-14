import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './request.entity';
import { Repository } from 'typeorm';
import { RequestCreateDto } from './dto/request.create.dto';

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

  async create(createDto: RequestCreateDto) {
    const request = this.repo.create(createDto);

    return await request.save();
  }

  // async update() {
  //   return this.repo.update();
  // }
}
