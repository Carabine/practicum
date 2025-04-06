import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { DocumentModule } from 'src/document/document.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { AdminController } from './admin.controller';
import { MailerModule } from '../../mailer/mailer.module';

@Module({
  providers: [UtilsService],
  controllers: [AdminController],
  imports: [ConfigModule, PdfModule, UtilsModule, DocumentModule, MailerModule]
})
export class AdminModule {}
