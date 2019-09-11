import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Request } from './request.entity';
import { RequestService } from './request.service';
import { RequestCreateDto } from './dto/request.create.dto';

@Controller('request')
export class RequestController {
  constructor(public service: RequestService) {}

  @Get()
  @Render('request/index')
  async findAll(): Promise<any> {
    return this.service.findAll();
  }

  @Get('/new')
  @Render('request/new')
  new() {
    return {};
  }

  @Post()
  async create(@Body() requestCreateDto: RequestCreateDto): Promise<any> {
    console.log(requestCreateDto);

    return {};
  }

  @Get('/new')
  @Render('request/edit')
  async update() {
    // return await this.service.update();
  }
}
