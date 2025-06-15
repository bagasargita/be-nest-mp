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
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('bank')
export class BankController {
  constructor(private readonly service: BankService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBankDto, @Req() request: any) {
    const username = request.user.username || 'system'; // Default to 'system' if username is not provided 
    return this.service.create(dto, username);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateBankDto,
    @Req() request: any,
  ) {
    const username = request.user.username || 'system'; // Default to 'system' if username is not provided
    return this.service.update(id, dto, username);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}