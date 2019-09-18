import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestCreateDto } from './dto/request.create.dto';
import { Response, Request } from 'express';

@Controller('request')
export class RequestController {
  constructor(public service: RequestService) {}

  @Get()
  @Render('request/index')
  async findAll(): Promise<any> {
    const requests = await this.service.findAll();

    return { requests };
  }

  @Get('/new')
  @Render('request/new')
  new() {
    return {};
  }

  @Post()
  async create(@Body() requestCreateDto: RequestCreateDto, @Req() req: any, @Res() res: Response ): Promise<any> {
    try {
      this.service.create(requestCreateDto);
    } catch (e) {
      return { errors: ['1', '2'] };
    }

    req.flash('success', 'Message');

    res.redirect('/');
  }
}
