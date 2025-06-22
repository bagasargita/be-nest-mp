import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentType } from './entities/document-type.entity';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';

@Injectable()
export class DocumentTypeService {
  constructor(
    @InjectRepository(DocumentType)
    private readonly repo: Repository<DocumentType>,
  ) {}

  async create(dto: CreateDocumentTypeDto, username?: string): Promise<DocumentType> {
    const docType = this.repo.create({
      ...dto,
      created_by: username || 'system'
    });
    
    return this.repo.save(docType);
  }

  async findAll(): Promise<DocumentType[]> {
    // const where = isActive !== undefined ? { is_active: isActive } : {};
    return this.repo.find({
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string): Promise<DocumentType> {
    const docType = await this.repo.findOne({
      where: { id }
    });
    
    if (!docType) {
      throw new NotFoundException(`Document type with id ${id} not found`);
    }
    
    return docType;
  }

  async update(id: string, dto: UpdateDocumentTypeDto, username?: string): Promise<DocumentType> {
    const docType = await this.findOne(id);
    
    Object.assign(docType, dto);
    
    if (username) {
      docType.updated_by = username;
    }
    docType.updated_at = new Date();
    
    return this.repo.save(docType);
  }

  async remove(id: string): Promise<void> {
    const docType = await this.findOne(id);
    await this.repo.remove(docType);
  }
}