import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventPayloads } from '../interface/event-types.interface';
@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }

  async welcomeEmail(data) {
    const { username } = data;

    const subject = `Welcome to Company: ${username}`;

    await this.mailerService.sendMail({
      to: username,
      subject,
      template: './welcome',
      context: {
        username,
      },
    });
  }

  @OnEvent('user.signin-email')
  async welcomeEmailByEventEmitter(data: EventPayloads['user.signin-email']) {
    const { username } = data;

    const subject = `${username} is just signed in`;

    await this.mailerService.sendMail({
      to: username,
      subject,
      template: './sign-in',
      context: {
        username,
      },
    });
  }
}
