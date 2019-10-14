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
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import i18n from 'i18n';
import { InterviewService } from './interview.service';
import { UserService } from '../user/user.service';
import { InterviewApplicationDto, InterviewAssignmentDto } from './dto';
import { Role } from '../auth/role.decorator';
import { RoleGuard, AuthenticatedGuard } from '../../common/guards';
import { BadRequestExceptionFilter } from '../../common/filters/bad-request-exception.filter';
import { User } from '../user/user.entity';
import { Interview } from './interview.entity';

@Controller('interview')
@UseGuards(RoleGuard)
export class InterviewController {
  private readonly logger = new Logger(InterviewController.name);

  constructor(public interviewService: InterviewService, public userService: UserService) {}

  @UseGuards(AuthenticatedGuard)
  @Role('admin')
  @Get()
  @Render('interview/index')
  async findAll(): Promise<{ interviews: Interview[] }> {
    const interviews = await this.interviewService.getApplications();
    return { interviews };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/new')
  @Render('interview/application')
  getApplictionForm(): {} {
    return {};
  }

  @UseGuards(AuthenticatedGuard)
  @UseFilters(new BadRequestExceptionFilter('interview/application'))
  @Post()
  async addApplication(
    @Body() interviewApplicationDto: InterviewApplicationDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const { user } = req;
    if (user) {
      await this.interviewService.addApplication(interviewApplicationDto, user as User);
      req.flash('success', i18n.__('interview.application_accepted'));
      res.redirect('/');
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Role('admin')
  @Get(':id/assignment')
  @Render('interview/assignment')
  async getAssignment(@Param('id') id: number): Promise<{ interview: Interview; interviewers: User[] }> {
    // FIXME: move entities obtain and check to custom decorator. https://docs.nestjs.com/custom-decorators
    const interview = await this.interviewService.getOne(id);
    if (!interview) {
      throw new NotFoundException();
    }
    const interviewers = await this.userService.getInterviewers();
    return { interview, interviewers };
  }

  @UseGuards(AuthenticatedGuard)
  @Role('admin')
  // FIXME: current error render implementation not supports forms with additional data.
  // (like { interview, interviewers } here)
  // @UseFilters(new BadRequestExceptionFilter('interview/assignment'))
  @Post(':id/assignment')
  async assign(@Param('id') id: number, @Body() dto: InterviewAssignmentDto, @Res() res: Response): Promise<void> {
    await this.interviewService.assign(id, dto);
    res.redirect('/');
  }
}
