import { InjectRepository } from '@nestjs/typeorm';
import { Interview } from './interview.entity';
import { Repository } from 'typeorm';
import { InterviewCreateDto } from './dto/interview.create.dto';

export class InterviewService {
  constructor(
    @InjectRepository(Interview) private readonly repo: Repository<Interview>,
  ) {}

  async findAll() {
    return await this.repo.find();
  }

  async findOne() {
    return await this.repo.findOne();
  }

  async create(createDto: InterviewCreateDto) {
    const request = this.repo.create(createDto);

    return await request.save();
  }
}
