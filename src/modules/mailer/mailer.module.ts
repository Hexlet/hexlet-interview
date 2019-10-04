import { Module } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { MailerService } from './mailer.service';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MailerService,
      useFactory: (configService: ConfigService) => {
        const transporter = createTransport({
          host: configService.mailParams.host,
          port: configService.mailParams.port,
          auth: {
            user: configService.mailParams.user,
            pass: configService.mailParams.pass,
          },
        });

        return new MailerService(transporter, configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [MailerService],
})
export class MailerModule {}
