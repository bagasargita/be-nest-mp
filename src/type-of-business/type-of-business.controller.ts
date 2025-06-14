import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TypeOfBusinessService } from './type-of-business.service';
import { CreateTypeOfBusinessDto } from './dto/create-type-of-business.dto';
import { UpdateTypeOfBusinessDto } from './dto/update-type-of-business.dto';

@Controller('type-of-business')
export class TypeOfBusinessController {
  constructor(private readonly service: TypeOfBusinessService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTypeOfBusinessDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTypeOfBusinessDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}