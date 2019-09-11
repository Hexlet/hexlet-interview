import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from '../../ormconfig';
import { RequestController } from '../request/request.controller';
import { RequestModule } from '../request/request.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    RequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
