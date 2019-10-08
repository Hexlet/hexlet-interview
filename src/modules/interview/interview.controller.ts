import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import * as i18n from 'i18n';
import { InterviewService } from './interview.service';
import { InterviewCreateDto } from './dto/interview.create.dto';
import { AuthenticatedGuard } from '../auth/guards';
import { Role } from '../auth/role.decorator';
import { RoleGuard } from '../auth/guards/role.guard';

@Controller('interview')
@UseGuards(RoleGuard)
export class InterviewController {
  constructor(public service: InterviewService) {}

  @UseGuards(AuthenticatedGuard)
  @Role('admin')
  @Get()
  @Render('interview/index')
  async findAll(): Promise<any> {
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
  async create(@Body() interviewCreateDto: InterviewCreateDto, @Req() req: any, @Res() res: Response): Promise<any> {
    await this.service.create(interviewCreateDto, req.user);

    req.flash('success', i18n.__('interview.request_accepted'));
    res.redirect('/');
  }
}
