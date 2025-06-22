import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentType } from './entities/document-type.entity';
import { DocumentTypeService } from './document-type.service';
import { DocumentTypeController } from './document-type.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentType]),
  ],
  controllers: [DocumentTypeController],
  providers: [DocumentTypeService],
  exports: [DocumentTypeService],
})
export class DocumentTypeModule {}
