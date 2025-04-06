import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailStrategy } from './mail-strategy.interface';

@Injectable()
export class TextMailStrategy implements MailStrategy {
  constructor(private readonly transporter: nodemailer.Transporter) {}

  async send(mailOptions: nodemailer.SendMailOptions): Promise<void> {
    await this.transporter.sendMail(mailOptions);
  }
}
