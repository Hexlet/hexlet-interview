import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { Interview } from './interview.entity';
import { CreateInterviewDto } from './dto/create.dto';
import { IdParamDto } from '../../common/dto/id.dto';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get()
  async getInterviews(): Promise<Interview[]> {
    return this.interviewService.getInterviews();
  }

  @Post()
  async createInterview(@Body() body: CreateInterviewDto): Promise<void> {
    return this.interviewService.createInterview(body);
  }

  @Delete(':id')
  async deleteRole(@Param() params: IdParamDto): Promise<void> {
    await this.interviewService.deleteInterview(params.id);
  }
}
