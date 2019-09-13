import { Body, Render, Controller, Get, Put, Post, Param, Res } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.create.dto';

@Controller('user')
export class UserController {
  constructor(public service: UserService) {}

  @Get()
  @Render('user/index')
  async findAll(): Promise<any> {
    const users = await this.service.findAll();
    return { users };
  }

  @Get('/new')
  @Render('user/new')
  new() {
    return {};
  }

  @Post()
  async create(@Res() res, @Body() userCreateDto: UserCreateDto): Promise<any> {
    console.log(`userCreatedDto: ${JSON.stringify(userCreateDto)}`);
    this.service.create(userCreateDto);
    return res.redirect('user');
  }

  @Put(':id/update')
  async update(@Param('id') id, @Body() userCreateDto: UserCreateDto): Promise<any> {
    }
}
