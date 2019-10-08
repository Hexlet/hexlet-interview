import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { GitHubStrategy } from './github.strategy';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '../config/config.module';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { SessionSerializer } from './session.serializer';
import { AuthController } from './auth.controller';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule, PassportModule, MailerModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GitHubStrategy, UserService, SessionSerializer],
})
export class AuthModule {}
