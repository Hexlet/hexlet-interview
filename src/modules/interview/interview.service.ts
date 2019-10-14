import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Interview } from './interview.entity';
import { InterviewApplicationDto, InterviewAssignmentDto } from './dto';
import { User } from '../user/user.entity';

@Injectable()
export class InterviewService {
  constructor(@InjectRepository(Interview) private readonly interviewRepo: Repository<Interview>) {}

  async getApplications(): Promise<Interview[]> {
    return this.interviewRepo.find({
      where: { state: 'application' },
      relations: ['interviewee'],
      order: { date: 'DESC' },
    });
  }

  async getPast(): Promise<Interview[]> {
    return this.interviewRepo.find({
      where: { state: 'passed' },
      relations: ['interviewee', 'interviewer'],
      order: { date: 'DESC' },
    });
  }

  async getComing(): Promise<Interview[]> {
    return this.interviewRepo.find({
      where: { state: 'coming' },
      relations: ['interviewee', 'interviewer'],
      order: { date: 'DESC' },
    });
  }

  async getOne(id: number): Promise<Interview | undefined> {
    return this.interviewRepo.findOne(id, {
      relations: ['interviewee', 'interviewer'],
    });
  }

  addApplication(interviewApplicationDto: InterviewApplicationDto, user: User): Promise<Interview> {
    const entity = { ...interviewApplicationDto, interviewee: user, state: 'application' };
    const interview = this.interviewRepo.create(entity);
    return interview.save();
  }

  async assign(id: number, interviewAssignmentDto: InterviewAssignmentDto): Promise<Interview> {
    const toUpdate = await this.interviewRepo.findOne(id);
    return this.interviewRepo.save({ ...toUpdate, ...interviewAssignmentDto, state: 'coming' });
  }
}
