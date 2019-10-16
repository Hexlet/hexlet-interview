import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  Param,
  UseGuards,
  UseFilters,
  NotFoundException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { InterviewService } from './interview.service';
import { UserService } from '../user/user.service';
import { InterviewAssignmentDto } from './dto';
import { Role } from '../auth/role.decorator';
import { RoleGuard, AuthenticatedGuard } from '../../common/guards';
import { BadRequestExceptionFilter } from '../../common/filters/bad-request-exception.filter';
import { User } from '../user/user.entity';
import { Interview } from './interview.entity';

@Controller('interview/manage')
@UseGuards(AuthenticatedGuard)
@UseGuards(RoleGuard)
export class InterviewAdminController {
  constructor(public interviewService: InterviewService, public userService: UserService) {}

  @Get(':state')
  // TODO: Add ability to set Role for whole controller not only route.
  @Role('admin')
  @Render('interview/manage')
  async findAll(@Param('state') state: string): Promise<{ interviews: Interview[]; options: object; state: string }> {
    const stateOptions = {
      application: {
        where: { state: 'application' },
        relations: ['interviewee'],
      },
      coming: {
        where: { state: 'coming' },
        relations: ['interviewee', 'interviewer'],
      },
      passed: {
        where: { state: 'passed' },
        relations: ['interviewee', 'interviewer'],
      },
      canceled: {
        where: { state: 'canceled' },
        relations: ['interviewee', 'interviewer'],
      },
    };
    const options = stateOptions[state];
    if (!options) {
      throw new NotFoundException();
    }
    const interviews = await this.interviewService.get(options);
    return { interviews, options, state };
  }

  @Get(':id/assignment')
  @Role('admin')
  @Render('interview/assignment')
  async getAssignment(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<{ interview: Interview; interviewers: User[] }> {
    const interview = await this.interviewService.findOneById(id);
    if (!interview) {
      throw new NotFoundException();
    }
    const interviewers = await this.userService.getInterviewers();
    const renderData = { interview, interviewers };
    // Save data for error render in BadRequestExceptionFilter.
    // TODO: need some app level mechanism to store this.
    req.session!.savedRenderData = renderData;
    return renderData;
  }

  @UseGuards(AuthenticatedGuard)
  @Role('admin')
  @UseFilters(new BadRequestExceptionFilter('interview/assignment'))
  @Post(':id/assignment')
  async assign(
    @Param('id') id: number,
    @Body() dto: InterviewAssignmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    await this.interviewService.assign(id, dto);
    // Delete data in case form was correctly processed.
    delete req.session!.savedRenderData;
    res.redirect('/interview/manage/application');
  }
}
