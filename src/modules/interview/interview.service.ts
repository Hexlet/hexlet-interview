import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Interview } from './interview.entity';
import { InterviewApplicationDto, InterviewAssignmentDto } from './dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview) private readonly interviewRepo: Repository<Interview>,
    public userService: UserService,
  ) {}

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
    const { interviewerId, ...assignData } = interviewAssignmentDto;
    const interviewer = await this.userService.findOneById(Number(interviewerId));
    if (!interviewer) {
      throw new BadRequestException("Can't find such user");
    }
    return this.interviewRepo.save({
      ...toUpdate,
      ...assignData,
      interviewer,
      state: 'coming',
    });
  }
}
