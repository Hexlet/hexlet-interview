import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: configService.mailParams.host,
      port: configService.mailParams.port,
      auth: {
        user: configService.mailParams.user,
        pass: configService.mailParams.pass,
      },
    });
  }

  async sendVerifyLink(email: string, link: string): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.mailParams.fromMail,
        to: email,
        subject: 'Verification link for Hexlet-inteview',
        text: 'Confirm email',
        html: `<a href="${link}">Confirm email</a>`,
      });

      this.logger.log(`Message sent to ${email} with id ${info.messageId}`);

      return true;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
