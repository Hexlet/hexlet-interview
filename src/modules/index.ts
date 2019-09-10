import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { InterviewModule } from './interview/interview.module';
import { StartModule } from './app/app.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return configService.dbParams;
      },
    }),
    InterviewModule,
    ConfigModule,
    StartModule,
  ],
})
export class AppModule {}
