import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewModule } from '../interview/interview.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from '../auth/guards/role.guard';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.dbParams,
    }),
    InterviewModule,
    AuthModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
