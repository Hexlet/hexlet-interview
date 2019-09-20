import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { Interview } from './interview.entity';
import { PastInterview } from './past-interview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview, PastInterview])],
  providers: [InterviewService],
  controllers: [InterviewController],
  exports: [InterviewService],
})
export class InterviewModule {}
