import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewCreateDto } from './dto/interview.create.dto';
import { Response } from 'express';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import * as i18n from 'i18n';

@Controller('interview')
export class InterviewController {
  constructor(public service: InterviewService) {}

  @Get()
  @Render('interview/index')
  async findAll(): Promise<any> {
    const interviews = await this.service.findAll();

    return { interviews };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/new')
  @Render('interview/new')
  new() {
    return {};
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(@Body() interviewCreateDto: InterviewCreateDto, @Req() req: any, @Res() res: Response): Promise<any> {
    this.service.create(interviewCreateDto, req.user);

    req.flash('success', i18n.__('interview.request_accepted'));
    res.redirect('/');
  }
}
