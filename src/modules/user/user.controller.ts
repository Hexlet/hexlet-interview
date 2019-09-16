import { Body, Render, Controller, Get, Put, Post, Param, Res, Delete, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.create.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(public service: UserService) {}

    @Get('/new')
  @Render('user/new')
  new() {
    return {};
  }

  @Post()
  async create(@Res() res, @Body() userCreateDto: UserCreateDto): Promise<any> {
    await this.service.create(userCreateDto);
    return res.redirect('user');
  }

/*
  @Put(':id/update')
  async update(@Param('id') id, @Body() userCreateDto: UserCreateDto): Promise<any> {
  }
*/
  @Delete(':id/delete')
  async delete(@Res() res, @Param('id') id): Promise<any> {
    await this.service.delete(id);
    return res.redirect('user');
  }
}
