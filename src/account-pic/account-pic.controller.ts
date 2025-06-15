import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Req, // Untuk mengakses object request
} from '@nestjs/common';
import { AccountPICService } from './account-pic.service';
import { CreateAccountPICDto } from './dto/create-account-pic.dto';
import { UpdateAccountPICDto } from './dto/update-account-pic.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('account-pic')
export class AccountPICController {
  constructor(private readonly service: AccountPICService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAccountPICDto, @Req() request: any) {
    const username = request.user.username || 'system'; // Ambil username dari request, default ke 'system'
    return this.service.create(dto, username);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateAccountPICDto,
    @Req() request: any,
  ) {
    const username = request.user.username || 'system'; // Ambil username dari request, default ke 'system'
    return this.service.update(id, dto, username);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}