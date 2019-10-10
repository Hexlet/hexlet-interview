import { Body, Controller, Get, Post, Render, Req, Res, UseGuards, UseFilters } from '@nestjs/common';
import { Response, Request } from 'express';
import i18n from 'i18n';
import { InterviewService } from './interview.service';
import { InterviewCreateDto } from './dto/interview.create.dto';
import { Role } from '../auth/role.decorator';
import { RoleGuard, AuthenticatedGuard } from '../../common/guards';
import { BadRequestExceptionFilter } from '../../common/filters/bad-request-exception.filter';
import { User } from '../user/user.entity';

@Controller('interview')
@UseGuards(RoleGuard)
export class InterviewController {
  constructor(public service: InterviewService) {}

  @UseGuards(AuthenticatedGuard)
  @Role('admin')
  @Get()
  @Render('interview/index')
  async findAll(): Promise<object> {
    const interviews = await this.service.findAll({ state: 'new' });
    return { interviews };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/new')
  @Render('interview/new')
  new(): {} {
    return {};
  }

  @UseGuards(AuthenticatedGuard)
  @UseFilters(new BadRequestExceptionFilter('interview/new'))
  @Post()
  async create(
    @Body() interviewCreateDto: InterviewCreateDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.service.create(interviewCreateDto, req.user as User);
    req.flash('success', i18n.__('interview.request_accepted'));
    res.redirect('/');
  }
}
