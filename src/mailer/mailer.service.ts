import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../config/config.service';
import { HtmlMailStrategy } from './html-mail.strategy';
import { MailStrategy } from './mail-strategy.interface';
import { TextMailStrategy } from './text-mail.strategy';

@Injectable()
export class MailerService {
  private mailStrategy: MailStrategy;
  private transporter: nodemailer.Transporter;
  private readonly htmlMailStrategy: HtmlMailStrategy;
  private readonly textMailStrategy: TextMailStrategy;

  constructor(
    private readonly config: ConfigService,
  ) {
    this.transporter = this.createTransporter();
    this.mailStrategy = this.textMailStrategy;
  }

  private createTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.config.get('GMAIL_MAIL'),
        pass: this.config.get('GMAIL_PASS'),
      },
    });
  }

  setMailStrategy(strategy: MailStrategy) {
    this.mailStrategy = strategy;
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: this.config.get('GMAIL_MAIL'),
      to,
      subject,
      text,
    };

    try {
      await this.mailStrategy.send(mailOptions);
      console.log('Email sent');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}