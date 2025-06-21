import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { RevenueRuleService } from './revenue-rules.service';
import { CreateRevenueRuleDto } from './dto/create-revenue-rules.dto';
import { UpdateRevenueRuleDto } from './dto/update-revenue-rules.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('revenue-rules')
@ApiBearerAuth()
@Controller('revenue-rules')
export class RevenueRuleController {
  constructor(private readonly revenueRuleService: RevenueRuleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new revenue rule' })
  create(@Body() createRevenueRuleDto: CreateRevenueRuleDto) {
    return this.revenueRuleService.create(createRevenueRuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all revenue rules in tree structure' })
  findAll() {
    return this.revenueRuleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific revenue rule by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  findOne(@Param('id') id: string) {
    return this.revenueRuleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a revenue rule' })
  @ApiParam({ name: 'id', type: 'number' })
  update(
    @Param('id') id: string,
    @Body() updateRevenueRuleDto: UpdateRevenueRuleDto
  ) {
    return this.revenueRuleService.update(id, updateRevenueRuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a revenue rule' })
  @ApiParam({ name: 'id', type: 'number' })
  remove(@Param('id') id: string) {
    return this.revenueRuleService.remove(id);
  }
} 