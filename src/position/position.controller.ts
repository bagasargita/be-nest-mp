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
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('position')
export class PositionController {
  constructor(private readonly service: PositionService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePositionDto, @Req() request: any) {
    const username = request.user.username || 'system'; // Ambil username dari request, default ke 'system'
    return this.service.create(dto, username);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdatePositionDto,
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