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
import { AccountCategoryService } from './account-category.service';
import { CreateAccountCategoryDto } from './dto/create-account-category.dto';
import { UpdateAccountCategoryDto } from './dto/update-account-category.dto';
// import { JwtAuthGuard } from 'src/infrastructure/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth() // Menambahkan Swagger Bearer Auth
@Controller('account-category')
// @UseGuards(JwtAuthGuard) // Menggunakan guard untuk melindungi endpoint
export class AccountCategoryController {
  constructor(private readonly service: AccountCategoryService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAccountCategoryDto, @Req() request: any) {
    const username = request.user.username || 'system'; // Ambil username dari request, default ke 'system'
    return this.service.create(dto, username);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateAccountCategoryDto, 
    @Req() request: any,
  ){
    const username = request.user.username || 'system'; // Ambil username dari request, default ke 'system'
    return this.service.update(id, dto, username);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}