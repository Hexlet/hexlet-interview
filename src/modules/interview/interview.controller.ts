import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import i18n from 'i18n';
import { InterviewService } from './interview.service';
import { InterviewCreateDto } from './dto/interview.create.dto';
import { AuthenticatedGuard } from '../auth/guards';
import { Role } from '../auth/role.decorator';
import { RoleGuard } from '../auth/guards/role.guard';
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
