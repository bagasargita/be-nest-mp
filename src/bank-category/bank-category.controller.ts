import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BankCategoryService } from './bank-category.service';
import { CreateBankCategoryDto } from './dto/create-bank-category.dto';
import { UpdateBankCategoryDto } from './dto/update-bank-category.dto';

@Controller('bank-category')
export class BankCategoryController {
  constructor(private readonly service: BankCategoryService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBankCategoryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBankCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}