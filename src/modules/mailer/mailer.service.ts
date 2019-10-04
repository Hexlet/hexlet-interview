import { Injectable, Logger } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { ConfigService } from '../config/config.service';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor(
    private readonly transporter: Transporter,
    private readonly config: ConfigService,
  ) {}

  async sendVerifyLink(email: string, link: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: this.config.mailParams.fromMail,
        to: email,
        subject: 'Verification link for Hexlet-inteview',
        text: 'Confirm email',
        html: `<a href="${link}">Confirm email</a>`,
      });

      this.logger.log(`Message sent to ${email}`);
      return true;
    } catch (error) {
      console.log(error);
      this.logger.error(this.config.mailParams);
      this.logger.error(error);
    }
    return false;
  }
}
