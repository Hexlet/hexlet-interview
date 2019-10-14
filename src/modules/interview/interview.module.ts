import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewService } from './interview.service';
import { UserModule } from '../user/user.module';
import { InterviewController } from './interview.controller';
import { Interview } from './interview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview]), UserModule],
  providers: [InterviewService],
  controllers: [InterviewController],
  exports: [InterviewService],
})
export class InterviewModule {}
