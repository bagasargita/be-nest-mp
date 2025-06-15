import { Controller, Get, Post, Body, Param, Put, Delete, Patch, ParseUUIDPipe, Req } from '@nestjs/common';
import { IndustryService } from './industry.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('industry')
export class IndustryController {
  constructor(private readonly service: IndustryService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateIndustryDto, @Req() request: any) {
    const username = request.user.username || 'system'; // Ambil username dari request, default ke 'system'
    return this.service.create(dto, username);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateIndustryDto,
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