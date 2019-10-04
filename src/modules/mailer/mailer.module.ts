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
      useFactory: (config: ConfigService): MailerService => {
        const transporter: Transporter = createTransport({
          host: config.mailParams.host,
          port: config.mailParams.port,
          secure: config.mailParams.secure,
          requireTLS: config.mailParams.requireTLS,
          auth: {
            user: config.mailParams.user,
            pass: config.mailParams.pass,
          },
        });

        return new MailerService(transporter, config);
      },
      inject: [ConfigService],
    },
  ],
  exports: [MailerService],
})
export class MailerModule {}
