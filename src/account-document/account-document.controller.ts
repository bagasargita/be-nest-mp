import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  Req,
  Res,
  Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AccountDocumentService } from './account-document.service';
import { CreateAccountDocumentDto } from './dto/create-account-document.dto';
import { UpdateAccountDocumentDto } from './dto/update-account-document.dto';
import { Response } from 'express';
import { Multer } from 'multer';

@ApiTags('account-document')
@ApiBearerAuth()
@Controller('account-document')
export class AccountDocumentController {
  constructor(private readonly service: AccountDocumentService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        account_id: { type: 'string' },
        document_type: { type: 'string' },
        expires_at: { type: 'string', format: 'date' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateAccountDocumentDto,
    @Req() request: any
  ) {
    const username = request.user?.username || 'system';
    return this.service.create(dto, file, username);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('account/:accountId')
  findByAccountId(@Param('accountId', ParseUUIDPipe) accountId: string) {
    return this.service.findByAccountId(accountId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/download')
  async download(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
    @Query('inline') inline?: string
  ) {
    const file = await this.service.getDocumentFile(id);
    
    const disposition = inline === 'true' 
      ? 'inline' 
      : 'attachment; filename=' + encodeURIComponent(file.filename);
    
    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': disposition,
    });
    
    res.sendFile(file.path);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccountDocumentDto,
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