import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewService } from './interview.service';
import { UserModule } from '../user/user.module';
import { InterviewApplicationController } from './interview.application.controller';
import { InterviewManageController } from './interview.manage.controller';
import { Interview } from './interview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview]), UserModule],
  providers: [InterviewService],
  controllers: [InterviewApplicationController, InterviewManageController],
  exports: [InterviewService],
})
export class InterviewModule {}
