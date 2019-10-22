import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Interview } from './interview.entity';
import { InterviewApplicationDto, InterviewAssignmentDto, InterviewAddEditDto } from './dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview) private readonly interviewRepo: Repository<Interview>,
    public userService: UserService,
  ) {}

  get(options: FindConditions<Interview> & FindManyOptions<Interview>): Promise<Interview[]> {
    const defaultOptions = {
      order: { date: 'DESC' },
    };
    return this.interviewRepo.find({
      ...defaultOptions,
      ...options,
    });
  }

  async findOneById(id: number): Promise<Interview | undefined> {
    return this.interviewRepo.findOne(id, {
      relations: ['interviewee', 'interviewer'],
    });
  }

  async create(dto: InterviewAddEditDto): Promise<Interview> {
    const { interviewerId, intervieweeId, ...restDto } = dto;
    let interviewee: User | undefined;
    let interviewer: User | undefined;
    if (interviewerId) {
      interviewer = await this.userService.findOneById(Number(interviewerId), 'interviewer');
    }
    if (intervieweeId) {
      interviewee = await this.userService.findOneById(Number(intervieweeId), 'user');
    }
    const entity = {
      ...restDto,
      interviewee,
      interviewer,
      // TODO: we need to trim empty props from request body on pipe level.
      date: restDto.date || undefined,
    };
    const interview = this.interviewRepo.create(entity);
    return interview.save();
  }

  async update(toUpdate: Interview, dto: InterviewAddEditDto): Promise<Interview> {
    const { interviewerId, intervieweeId, ...restDto } = dto;
    const interviewee = await this.userService.findOneById(Number(intervieweeId), 'user');
    let interviewer: User | null = null;
    if (interviewerId) {
      interviewer = (await this.userService.findOneById(Number(interviewerId), 'interviewer')) || null;
    }
    return this.interviewRepo.save({
      ...toUpdate,
      ...restDto,
      interviewee,
      interviewer,
      date: restDto.date || undefined,
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
