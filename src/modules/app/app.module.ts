import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from '../auth/auth.module';
import { InterviewModule } from '../interview/interview.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { MailerModule } from '../mailer/mailer.module';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.dbParams,
    }),
    InterviewModule,
    AuthModule,
    ConfigModule,
    MailerModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
