import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewCreateDto } from './dto/interview.create.dto';
import { Response } from 'express';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

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
    try {
      this.service.create(interviewCreateDto, req.user);
    } catch (e) {
      return { errors: ['1', '2'] };
    }

    req.flash('success', 'Message');

    res.redirect('/');
  }
}
