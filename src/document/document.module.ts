import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentService } from './document.service';
import { Document } from './document.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
