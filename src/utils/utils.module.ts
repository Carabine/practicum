import { Global, Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { CreatingFoldersService } from './creating-folders.service';
import { FormatterService } from './formatter.service';
import { UtilsService } from './utils.service';

@Global()
@Module({
  providers: [UtilsService, CreatingFoldersService, FormatterService],
  exports: [UtilsService, CreatingFoldersService, FormatterService],
  imports: [ConfigModule]
})
export class UtilsModule {}
