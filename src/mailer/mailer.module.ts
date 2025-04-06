import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigModule } from '../config/config.module';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    MailerService
  ],
  exports: [MailerService],
})
export class MailerModule {}
