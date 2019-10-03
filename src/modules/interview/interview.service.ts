import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Interview } from './interview.entity';
import { PastInterview } from './past-interview.entity';
import { InterviewCreateDto } from './dto/interview.create.dto';
import { User } from '../user/user.entity';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview) private readonly repo: Repository<Interview>,
    @InjectRepository(PastInterview)
    private readonly pastInterviewRepo: Repository<PastInterview>,
  ) {}

  findAll(): Promise<Interview[]> {
    return this.repo.find({ relations: ['interviewee'] });
  }

  findOne(): Promise<Interview> {
    return this.repo.findOne();
  }

  create(createDto: InterviewCreateDto, user: User): Promise<Interview> {
    const entity = { ...createDto, ...{ interviewee: user } };
    const interview = this.repo.create(entity);

    return interview.save();
  }

  getPast(): Promise<PastInterview[]> {
    // merge real passed interview with interviews which was in past before this werb-service
    return this.pastInterviewRepo.find();
  }
}
