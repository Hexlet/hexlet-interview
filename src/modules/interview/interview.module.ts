import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { Interview } from './interview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview])],
  providers: [InterviewService],
  controllers: [InterviewController],
})
export class InterviewModule {}
