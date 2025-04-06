import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { DocumentModule } from 'src/document/document.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { ProfileController } from './profile.controller';

@Module({
  controllers: [ProfileController],
  imports: [ConfigModule, PdfModule, DocumentModule]
})
export class ProfileModule {}