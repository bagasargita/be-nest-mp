import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { AccountCategoryService } from './account-category.service';
import { CreateAccountCategoryDto } from './dto/create-account-category.dto';
import { UpdateAccountCategoryDto } from './dto/update-account-category.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('account-category')
export class AccountCategoryController {
  constructor(private readonly service: AccountCategoryService) {}

  // Endpoint untuk ambil tree (struktur hierarki)
  @Get('tree')
  async findTree() {
    return this.service.findAllTree();
  }

  // Endpoint untuk ambil semua kategori (flat)
  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateAccountCategoryDto, @Req() request: any) {
    const username = request.user?.username || 'system';
    return this.service.create(dto, username);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccountCategoryDto,
    @Req() request: any,
  ) {
    const username = request.user?.username || 'system';
    return this.service.update(id, dto, username);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}