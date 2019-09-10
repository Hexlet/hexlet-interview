import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from '../../ormconfig';
import { I18nModule } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    I18nModule.forRoot({
      path: path.join(__dirname, '../../i18n'),
      filePattern: '*.json',
      fallbackLanguage: 'ru',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
