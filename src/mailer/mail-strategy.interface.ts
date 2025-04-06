import * as nodemailer from 'nodemailer';

export interface MailStrategy {
  send(mailOptions: nodemailer.SendMailOptions): Promise<void>;
}
