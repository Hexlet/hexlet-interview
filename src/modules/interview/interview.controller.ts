import { Body, Controller, Get, Post, Render, Req, Res, UseGuards, UseFilters } from '@nestjs/common';
import { Response, Request } from 'express';
import i18n from 'i18n';
import { InterviewService } from './interview.service';
import { UserService } from '../user/user.service';
import { InterviewApplicationDto } from './dto';
import { AuthenticatedGuard } from '../../common/guards';
import { BadRequestExceptionFilter } from '../../common/filters/bad-request-exception.filter';
import { User } from '../user/user.entity';

@Controller('interview')
@UseGuards(AuthenticatedGuard)
export class InterviewController {
  constructor(public interviewService: InterviewService, public userService: UserService) {}

  @Get('/application')
  @Render('interview/application')
  getApplictionForm(): {} {
    return {};
  }

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
}
