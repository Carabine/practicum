import { Global, Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { DocumentModule } from 'src/document/document.module';
import { UtilsModule } from 'src/utils/utils.module';
import { PdfService } from './pdf.service';

@Global()
@Module({
  providers: [PdfService],
  exports: [PdfService],
  imports: [UtilsModule, DocumentModule, ConfigModule]
})
export class PdfModule {}
