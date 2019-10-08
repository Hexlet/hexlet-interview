import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/app/app.module';
import { bootstrapApp } from './bootstrap';
import { ConfigService } from './modules/config/config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await bootstrapApp(app);
  const configService: ConfigService = app.get(ConfigService);
  await app.listen(configService.appPort);
}
bootstrap();
