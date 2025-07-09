import { Controller, Get, Post, Body, Param, Put, Delete, Patch, ParseUUIDPipe, Req } from '@nestjs/common';
import { TypeOfBusinessService } from './type-of-business.service';
import { CreateTypeOfBusinessDto } from './dto/create-type-of-business.dto';
import { UpdateTypeOfBusinessDto } from './dto/update-type-of-business.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Type of Business')
@ApiBearerAuth()
@Controller('type-of-business')
export class TypeOfBusinessController {
  constructor(private readonly service: TypeOfBusinessService) {}

  @Get()
  @ApiOperation({ summary: 'Get all types of business' })
  findAll() {
    return this.service.findAll();
  }

  @Get('parents')
  @ApiOperation({ summary: 'Get parent types of business only' })
  findParents() {
    return this.service.findParents();
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get types of business in tree structure' })
  findTree() {
    return this.service.findTree();
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Get children of a specific type of business' })
  findChildren(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findChildren(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific type of business' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new type of business' })
  create(@Body() dto: CreateTypeOfBusinessDto, @Req() request: any) {
    const username = request.user.username || 'system';
    return this.service.create(dto, username);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a type of business' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateTypeOfBusinessDto,
    @Req() request: any,
  ) {
    const username = request.user.username || 'system';
    return this.service.update(id, dto, username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a type of business' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}