import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Interview } from './interview.entity';
import { CreateInterviewDto } from './dto/create.dto';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
  ) {}

  async getInterviews(): Promise<Interview[]> {
    return this.interviewRepository.find();
  }

  async createInterview(body: CreateInterviewDto): Promise<void> {
    await this.interviewRepository.save(body);
  }

  async deleteInterview(interviewId: number): Promise<void> {
    await this.interviewRepository.delete(interviewId);
  }
}
