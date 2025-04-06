import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import {Document} from './document.entity'

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private DocumentsRepository: Repository<Document>,
  ) {}
  create(options: Document): Promise<Document> {
    return this.DocumentsRepository.save(this.DocumentsRepository.create(options))
  }

  findAll(options?: FindManyOptions<Document>): Promise<Document[]> {
    return this.DocumentsRepository.find(options);
  }

  findOne(options: FindOneOptions<Document>): Promise<Document> {
    return this.DocumentsRepository.findOne(options)
  }

  async remove(options): Promise<void> {
    await this.DocumentsRepository.delete(options)
  }

  count(options?: FindManyOptions<Document>): Promise<number> {
    return this.DocumentsRepository.count(options)
  }
}