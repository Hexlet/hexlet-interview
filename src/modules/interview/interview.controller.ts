import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewCreateDto } from './dto/interview.create.dto';
import { Response } from 'express';

@Controller('interview')
export class InterviewController {
  constructor(public service: InterviewService) {}

  @Get()
  @Render('interview/index')
  async findAll(): Promise<any> {
    const interviews = await this.service.findAll();

    return { interviews };
  }

  @Get('/new')
  @Render('interview/new')
  new() {
    return {};
  }

  @Post()
  async create(@Body() interviewCreateDto: InterviewCreateDto, @Req() req: any, @Res() res: Response): Promise<any> {
    try {
      this.service.create(interviewCreateDto);
    } catch (e) {
      return { errors: ['1', '2'] };
    }

    req.flash('success', 'Message');

    res.redirect('/');
  }
}
