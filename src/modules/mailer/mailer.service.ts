import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  // !!TODO mail sender will be here
  sendVerifyLink(email: string, token: string): Promise<void> {
    return;
  }
}
