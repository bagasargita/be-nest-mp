import { Controller, Get, Post, Body, Param, Put, Delete, Patch, ParseUUIDPipe, Req } from '@nestjs/common';
import { TypeOfBusinessService } from './type-of-business.service';
import { CreateTypeOfBusinessDto } from './dto/create-type-of-business.dto';
import { UpdateTypeOfBusinessDto } from './dto/update-type-of-business.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('type-of-business')
export class TypeOfBusinessController {
  constructor(private readonly service: TypeOfBusinessService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTypeOfBusinessDto, @Req() request: any) {
    const username = request.user.username || 'system'; // Ambil username dari request, default ke 'system'
    return this.service.create(dto, username);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateTypeOfBusinessDto,
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