import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
  UseFilters,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import i18n from 'i18n';
import { InterviewService } from './interview.service';
import { UserService } from '../user/user.service';
import { InterviewApplicationDto } from './dto';
import { AuthenticatedGuard } from '../../common/guards';
import { BadRequestExceptionFilter } from '../../common/filters/bad-request-exception.filter';
import { User } from '../user/user.entity';
import { FormData } from '../../common/utils/form-data';
import { ReqUser } from '../../common/decorators/req-user.decorator';

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
  @Post('/application')
  async addApplication(
    @Body() interviewApplicationDto: InterviewApplicationDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const { user } = req;
    if (user) {
      await this.interviewService.addApplication(interviewApplicationDto, user as User);
      req.flash('success', i18n.__('interview.application_accepted'));
      res.redirect('/my/application');
    }
  }

  @Get('/application/:id/edit')
  @Render('interview/application')
  async getApplictionEditForm(
    @Req() req: Request,
    @Param('id') applicationId: number,
    @ReqUser() user: User,
  ): Promise<{ editFormData: FormData; id: number }> {
    const interview = await this.interviewService.findOneById(applicationId);
    if (!interview || user.id !== interview.interviewee.id) {
      throw new NotFoundException();
    }
    const { interviewer, interviewee, date, createdAt, updatedAt, ...restInterview } = interview;
    const editFormData = new FormData({
      ...restInterview,
    });
    const renderData = { editFormData, id: applicationId };
    req.session!.savedRenderData = renderData;
    return renderData;
  }

  // TODO: should be PATCH on '/application/:id'
  @Post('/application/:id/edit')
  @UseFilters(new BadRequestExceptionFilter('interview/application'))
  async editApplication(
    @Body() interviewApplicationDto: InterviewApplicationDto,
    @Param('id') applicationId: number,
    @ReqUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const interview = await this.interviewService.findOneById(applicationId);
    if (!interview) {
      throw new NotFoundException();
    }
    if (user.id !== interview.interviewee.id) {
      throw new BadRequestException(i18n.__('interview.form.not-own-error'));
    }
    await this.interviewService.editApplication(interview, interviewApplicationDto);
    delete req.session!.savedRenderData;
    res.redirect('/my/application');
  }
}
