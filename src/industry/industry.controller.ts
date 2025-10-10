import { Controller, Get, Post, Body, Param, Put, Delete, Patch, ParseUUIDPipe, Req, Query } from '@nestjs/common';
import { IndustryService } from './industry.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Public } from '../core/decorators/public.decorator';

@ApiBearerAuth()
@Controller('industry')
export class IndustryController {
  constructor(private readonly service: IndustryService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all industries with optional filtering and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'code', required: false, type: String, description: 'Filter by industry code' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by industry name' })
  @ApiQuery({ name: 'is_active', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Field to sort by' })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('code') code?: string,
    @Query('name') name?: string,
    @Query('is_active') is_active?: boolean,
    @Query('sort') sort?: string,
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    return this.service.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      code,
      name,
      is_active,
      sort,
      order,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get industry by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new industry' })
  create(@Body() dto: CreateIndustryDto, @Req() request: any) {
    const username = request.user.username || 'system'; // Ambil username dari request, default ke 'system'
    return this.service.create(dto, username);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update industry by ID' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateIndustryDto,
    @Req() request: any,
  ) {
    const username = request.user.username || 'system'; // Ambil username dari request, default ke 'system'
    return this.service.update(id, dto, username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete industry by ID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }

  @Public()
  @Post('bulk')
  @ApiOperation({ summary: 'Create or update multiple industries in bulk' })
  async createBulk(@Body() data: CreateIndustryDto[]) {
    const results: any[] = [];
    
    for (const item of data) {
      try {
        // Check if item exists by code first
        const existing = await this.service.findByCode(item.code);
        
        if (existing) {
          // Update existing item
          const updated = await this.service.update(existing.id, item, 'system');
          results.push({ success: true, data: updated, item, action: 'updated' });
        } else {
          // Create new item
          const created = await this.service.create(item, 'system');
          results.push({ success: true, data: created, item, action: 'created' });
        }
      } catch (error) {
        results.push({ success: false, error: error.message, item });
      }
    }
    
    return { success: true, results };
  }
}