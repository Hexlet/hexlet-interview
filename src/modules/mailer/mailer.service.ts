import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { ConfigService } from '../config/config.service';

@Injectable()
export class MailerService implements OnModuleInit {
  private readonly logger = new Logger(MailerService.name);

  constructor(
    private readonly transporter: Transporter,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('Mail server ready...');
    } catch (e) {
      this.logger.error(e);
    }
  }

  async sendVerifyLink(email: string, link: string): Promise<boolean> {
    try {
      const html = `<a href="${link}">${link}</a>`;
      await this.transporter.sendMail({
        from: this.config.mailParams.fromMail,
        to: email,
        subject: 'Verification link for Hexlet-inteview',
        text: 'Confirm email',
        html,
      });

      this.logger.log(`Message sent to ${email}`, JSON.stringify({ html }));
      return true;
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
    return false;
  }
}
