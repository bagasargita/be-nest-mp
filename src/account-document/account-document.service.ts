import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountDocument } from './entities/account-document.entity';
import { CreateAccountDocumentDto } from './dto/create-account-document.dto';
import { UpdateAccountDocumentDto } from './dto/update-account-document.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AccountDocumentService {
  constructor(
    @InjectRepository(AccountDocument)
    private readonly repo: Repository<AccountDocument>,
  ) {}

  async create(
    dto: CreateAccountDocumentDto,
    file: Express.Multer.File,
    username?: string
  ): Promise<AccountDocument> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Generate unique filename
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Write file to disk
    fs.writeFileSync(filePath, file.buffer);
    
    // Create document record
    const document = this.repo.create({
      account: { id: dto.account_id },
      document_type: dto.document_type,
      expires_at: dto.expires_at,
      filename: file.originalname,
      file_path: `uploads/documents/${fileName}`,
      file_size: file.size,
      mime_type: file.mimetype,
      created_by: username || 'system'
    });
    
    return this.repo.save(document);
  }

  async findAll(): Promise<AccountDocument[]> {
    return this.repo.find();
  }

  async findByAccountId(accountId: string): Promise<AccountDocument[]> {
    return this.repo.find({
      where: { account: { id: accountId } },
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: string): Promise<AccountDocument> {
    const document = await this.repo.findOne({
      where: { id }
    });
    
    if (!document) {
      throw new NotFoundException(`Account document with id ${id} not found`);
    }
    
    return document;
  }

  async update(
    id: string,
    dto: UpdateAccountDocumentDto,
    username?: string
  ): Promise<AccountDocument> {
    const document = await this.findOne(id);
    
    // Update fields
    if (dto.document_type !== undefined) {
      document.document_type = dto.document_type;
    }
    
    if (dto.expires_at !== undefined) {
      document.expires_at = dto.expires_at;
    }
    
    if (dto.is_active !== undefined) {
      document.is_active = dto.is_active;
    }
    
    // Audit fields
    if (username) {
      document.updated_by = username;
    }
    document.updated_at = new Date();
    
    return this.repo.save(document);
  }

  async remove(id: string): Promise<void> {
    const document = await this.findOne(id);
    
    // Delete file from disk
    if (document.file_path) {
      const fullPath = path.join(process.cwd(), document.file_path);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    
    await this.repo.remove(document);
  }

  async getDocumentFile(id: string): Promise<{ path: string, filename: string, mimeType: string }> {
    const document = await this.findOne(id);
    
    const fullPath = path.join(process.cwd(), document.file_path);
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('Document file not found on server');
    }
    
    return {
      path: fullPath,
      filename: document.filename,
      mimeType: document.mime_type
    };
  }
}