import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestCreateDto } from './dto/request.create.dto';

@Controller('request')
export class RequestController {
  constructor(public service: RequestService) {}

  @Get()
  @Render('request/index')
  async findAll(): Promise<any> {
    const all = await this.service.findAll();
    return {
      requests: [
        { username: 'Василий Пупкин', profession: 'Backend PHP developer', position: 'Junior' }
      ],
    };
  }

  @Get('/new')
  @Render('request/new')
  new() {
    return {};
  }

  @Post()
  async create(@Body() requestCreateDto: RequestCreateDto): Promise<any> {
    return this.service.create(requestCreateDto);
  }
}
