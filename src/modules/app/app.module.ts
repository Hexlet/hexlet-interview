import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from '../../ormconfig';
import { RequestModule } from '../request/request.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { UserController } from '../user/user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    RequestModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
