import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Req
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentTypeService } from './document-type.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';

@ApiTags('document-type')
@ApiBearerAuth()
@Controller('document-type')
export class DocumentTypeController {
  constructor(private readonly service: DocumentTypeService) {}

  @Post()
  create(@Body() dto: CreateDocumentTypeDto, @Req() request: any) {
    const username = request.user?.username || 'system';
    return this.service.create(dto, username);
  }

  @Get()
  findAll() {
  
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDocumentTypeDto,
    @Req() request: any
  ) {
    const username = request.user?.username || 'system';
    return this.service.update(id, dto, username);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}