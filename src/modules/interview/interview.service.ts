import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Interview } from './interview.entity';
import { InterviewCreateDto } from './dto/interview.create.dto';
import { User } from '../user/user.entity';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview) private readonly repo: Repository<Interview>,
  ) {}

  findAll(where: Partial<Interview>): Promise<Interview[]> {
    return this.repo.find({ relations: ['interviewee'], where });
  }

  findOne(): Promise<Interview> {
    return this.repo.findOne();
  }

  create(createDto: InterviewCreateDto, user: User): Promise<Interview> {
    const entity = { ...createDto, ...{ interviewee: user } };
    const interview = this.repo.create(entity);

    return interview.save();
  }

  async getPast(): Promise<Interview[]> {
    return this.repo.find({
      where: { state: 'passed' },
      relations: ['interviewee', 'interviewer'],
      order: { date: 'DESC' },
    });
  }

  async getComing(): Promise<Interview[]> {
    return this.repo.find({
      where: { state: 'coming' },
      relations: ['interviewee', 'interviewer'],
      order: { date: 'DESC' },
    });
  }
}
