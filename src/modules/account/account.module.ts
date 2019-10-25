import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewService } from '../interview/interview.service';
import { UserModule } from '../user/user.module';
import { AccountController } from './account.controller';
import { Interview } from '../interview/interview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview]), UserModule],
  providers: [InterviewService],
  controllers: [AccountController],
  exports: [InterviewService],
})
export class AccountModule {}
