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
import { InterviewAssignmentDto, InterviewAddEditDto } from './dto';
import { Role } from '../auth/role.decorator';
import { RoleGuard, AuthenticatedGuard } from '../../common/guards';
import { BadRequestExceptionFilter } from '../../common/filters/bad-request-exception.filter';
import { User } from '../user/user.entity';
import { Interview, interviewState } from './interview.entity';
import { FormData } from '../../common/utils/form-data';
import { prepareDate } from '../../common/utils/prepare-data.util';

@Controller('interview/manage')
@UseGuards(AuthenticatedGuard)
@UseGuards(RoleGuard)
export class InterviewAdminController {
  constructor(public interviewService: InterviewService, public userService: UserService) {}

  @Get(':id/assignment')
  // TODO: Add ability to set Role for whole controller not only route.
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

  @Post(':id/assignment')
  @Role('admin')
  @UseFilters(new BadRequestExceptionFilter('interview/assignment'))
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

  @Get('new')
  @Role('admin')
  @Render('interview/add-edit')
  async getNew(@Req() req: Request): Promise<{ interviewees: User[]; interviewers: User[] }> {
    const interviewers = await this.userService.getInterviewers();
    const interviewees = await this.userService.getInterviewees();
    const renderData = { interviewees, interviewers, interviewState };
    req.session!.savedRenderData = renderData;
    return renderData;
  }

  @Post('new')
  @Role('admin')
  @UseFilters(new BadRequestExceptionFilter('interview/add-edit'))
  async create(@Body() dto: InterviewAddEditDto, @Res() res: Response, @Req() req: Request): Promise<void> {
    await this.interviewService.create(dto);
    delete req.session!.savedRenderData;
    res.redirect('/interview/manage/application');
  }

  @Get(':id/edit')
  @Role('admin')
  @Render('interview/add-edit')
  async getEdit(@Req() req: Request, @Param('id') id: number): Promise<{ interviewees: User[]; interviewers: User[] }> {
    const interview = await this.interviewService.findOneById(id);
    if (!interview) {
      throw new NotFoundException();
    }
    const { interviewer, interviewee, date, createdAt, updatedAt, ...restInterview } = interview;
    const editFormData = new FormData({
      ...restInterview,
      date: date ? prepareDate(date) : '',
      intervieweeId: interview.interviewee ? interview.interviewee.id : '',
      interviewerId: interview.interviewer ? interview.interviewer.id : '',
    });
    const interviewers = await this.userService.getInterviewers();
    const interviewees = await this.userService.getInterviewees();
    const renderData = { editFormData, interviewees, interviewers, interviewState, id };
    req.session!.savedRenderData = renderData;
    return renderData;
  }

  // TODO: should be PUTCH method and :id url.
  @Post(':id/edit')
  @Role('admin')
  @UseFilters(new BadRequestExceptionFilter('interview/add-edit'))
  async edit(
    @Body() dto: InterviewAddEditDto,
    @Param('id') id: number,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const interview = await this.interviewService.findOneById(id);
    if (!interview) {
      throw new NotFoundException();
    }
    await this.interviewService.update(interview, dto);
    delete req.session!.savedRenderData;
    res.redirect('/interview/manage/application');
  }

  @Get(':state')
  @Role('admin')
  @Render('interview/manage')
  async findAll(@Param('state') state: string): Promise<{ interviews: Interview[]; options: object; state: string }> {
    const stateOptions = {
      application: {
        where: { state: interviewState.WAIT_FOR_INTERVIEWER },
        relations: ['interviewee'],
      },
      coming: {
        where: { state: interviewState.COMING },
        relations: ['interviewee', 'interviewer'],
      },
      passed: {
        where: { state: interviewState.PASSED },
        relations: ['interviewee', 'interviewer'],
      },
      cancelled: {
        where: { state: interviewState.CANCELLED },
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
}
