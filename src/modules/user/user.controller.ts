import { Body, Render, Controller, Get, Post, Param, Res, Delete, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.create.dto';
import { AuthenticatedGuard, RoleGuard } from '../../common/guards';
import { Role } from '../auth/role.decorator';
import { User } from './user.entity';

@Controller('user')
@UseGuards(RoleGuard)
export class UserController {
  constructor(public service: UserService) {}

  @UseGuards(AuthenticatedGuard)
  @Role('admin')
  @Get('/')
  @Render('user/index')
  async getUsers(): Promise<{ users: User[] }> {
    const users = await this.service.findAll();
    return { users };
  }

  @Get('/new')
  @Role('admin')
  @Render('user/new')
  new(): {} {
    return {};
  }

  @Post()
  @Role('admin')
  async create(@Res() res: Response, @Body() userCreateDto: UserCreateDto): Promise<void> {
    await this.service.createAndSave(userCreateDto);
    return res.redirect('user');
  }

  @Role('admin')
  @Delete(':id/delete')
  async delete(@Res() res: Response, @Param('id') id: number): Promise<void> {
    await this.service.delete(id);
    return res.redirect('user');
  }
}
