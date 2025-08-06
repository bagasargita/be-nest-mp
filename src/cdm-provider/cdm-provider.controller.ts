import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CdmProviderService } from './cdm-provider.service';
import { CreateCdmProviderDto } from './dto/create-cdm-provider.dto';
import { UpdateCdmProviderDto } from './dto/update-cdm-provider.dto';

@ApiTags('CDM Provider')
@ApiBearerAuth()
@Controller('cdm-provider')
export class CdmProviderController {
  constructor(private readonly cdmProviderService: CdmProviderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new CDM provider' })
  @ApiResponse({ status: 201, description: 'CDM provider created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  create(@Body() createCdmProviderDto: CreateCdmProviderDto, @Req() req: any) {
    const username = req.user?.username || 'system';
    return this.cdmProviderService.create(createCdmProviderDto, username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all CDM providers in tree structure' })
  @ApiResponse({ status: 200, description: 'CDM providers retrieved successfully' })
  @ApiQuery({ name: 'flat', required: false, type: Boolean, description: 'Return flat list instead of tree' })
  findAll(@Query('flat') flat?: boolean) {
    if (flat) {
      return this.cdmProviderService.findAllFlat();
    }
    return this.cdmProviderService.findAll();
  }

  @Get('hierarchy')
  @ApiOperation({ summary: 'Get CDM provider hierarchy tree' })
  @ApiResponse({ status: 200, description: 'Hierarchy retrieved successfully' })
  getHierarchy() {
    return this.cdmProviderService.getProviderHierarchy();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get CDM provider by ID' })
  @ApiParam({ name: 'id', description: 'CDM provider UUID' })
  @ApiResponse({ status: 200, description: 'CDM provider found' })
  @ApiResponse({ status: 404, description: 'CDM provider not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cdmProviderService.findOne(id);
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Get children of CDM provider' })
  @ApiParam({ name: 'id', description: 'CDM provider UUID' })
  @ApiResponse({ status: 200, description: 'Children retrieved successfully' })
  @ApiResponse({ status: 404, description: 'CDM provider not found' })
  findChildren(@Param('id', ParseUUIDPipe) id: string) {
    return this.cdmProviderService.findChildren(id);
  }

  @Get(':id/ancestors')
  @ApiOperation({ summary: 'Get ancestors of CDM provider' })
  @ApiParam({ name: 'id', description: 'CDM provider UUID' })
  @ApiResponse({ status: 200, description: 'Ancestors retrieved successfully' })
  @ApiResponse({ status: 404, description: 'CDM provider not found' })
  findAncestors(@Param('id', ParseUUIDPipe) id: string) {
    return this.cdmProviderService.findAncestors(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update CDM provider' })
  @ApiParam({ name: 'id', description: 'CDM provider UUID' })
  @ApiResponse({ status: 200, description: 'CDM provider updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 404, description: 'CDM provider not found' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCdmProviderDto: UpdateCdmProviderDto, @Req() req: any) {
    const username = req.user?.username || 'system';
    return this.cdmProviderService.update(id, updateCdmProviderDto, username);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Move CDM provider to new parent' })
  @ApiParam({ name: 'id', description: 'CDM provider UUID to move' })
  @ApiResponse({ status: 200, description: 'CDM provider moved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - circular reference' })
  @ApiResponse({ status: 404, description: 'CDM provider not found' })
  moveProvider(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { newParentId: string | null },
    @Req() req: any
  ) {
    const username = req.user?.username || 'system';
    return this.cdmProviderService.moveProvider(id, body.newParentId, username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete CDM provider' })
  @ApiParam({ name: 'id', description: 'CDM provider UUID' })
  @ApiResponse({ status: 200, description: 'CDM provider deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete provider with children' })
  @ApiResponse({ status: 404, description: 'CDM provider not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cdmProviderService.remove(id);
  }
}
