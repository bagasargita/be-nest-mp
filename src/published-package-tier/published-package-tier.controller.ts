import { 
  Controller, Get, Post, Patch, Delete, Body, 
  Param, UseGuards, Request, ParseUUIDPipe, 
  UploadedFile, UseInterceptors, BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../infrastructure/guards/auth.guard';
import { PublishedPackageTierService } from './published-package-tier.service';
import { CreatePublishedPackageTierDto, UpdatePublishedPackageTierDto } from './dto/published-package-tier.dto';

@ApiBearerAuth()
@ApiTags('Published Package Tiers')
@UseGuards(JwtAuthGuard)
@Controller('published-package-tiers')
export class PublishedPackageTierController {
  constructor(private readonly publishedPackageTierService: PublishedPackageTierService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new published package tier' })
  @ApiResponse({ status: 201, description: 'Published package tier created successfully' })
  create(@Body() createDto: CreatePublishedPackageTierDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.publishedPackageTierService.create(createDto, username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all published package tiers' })
  @ApiResponse({ status: 200, description: 'Return all published package tiers' })
  findAll() {
    return this.publishedPackageTierService.findAll();
  }

  @Get('debug/all')
  @ApiOperation({ summary: 'Get all published package tiers with debug info' })
  @ApiResponse({ status: 200, description: 'Return all published package tiers with readable format' })
  findAllForDebug() {
    return this.publishedPackageTierService.findAllForDebug();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a published package tier by ID' })
  @ApiParam({ name: 'id', description: 'Published Package Tier ID' })
  @ApiResponse({ status: 200, description: 'Return a published package tier' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.publishedPackageTierService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a published package tier' })
  @ApiParam({ name: 'id', description: 'Published Package Tier ID' })
  @ApiResponse({ status: 200, description: 'Published package tier updated successfully' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdatePublishedPackageTierDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.publishedPackageTierService.update(id, updateDto, username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a published package tier' })
  @ApiParam({ name: 'id', description: 'Published Package Tier ID' })
  @ApiResponse({ status: 200, description: 'Published package tier deleted successfully' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.publishedPackageTierService.remove(id);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple published package tiers' })
  @ApiResponse({ status: 201, description: 'Published package tiers created successfully' })
  createBulk(@Body() tiers: CreatePublishedPackageTierDto[], @Request() req) {
    const username = req.user?.username || 'system';
    return this.publishedPackageTierService.createBulk(tiers, username);
  }

  @Post('upload')
  @ApiOperation({ 
    summary: 'Upload published package tiers from CSV file',
    description: 'Upload a CSV file containing published package tier data to create multiple tiers at once.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file containing published package tier data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV file with published package tier data (max 10MB)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Upload completed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'number', description: 'Number of successfully created tiers' },
        errors: { type: 'array', items: { type: 'string' }, description: 'List of errors encountered' }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, callback) => {
      if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Only CSV files are allowed'), false);
      }
    }
  }))
  async uploadFromCsv(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    console.log('=== Upload Controller Debug ===');
    console.log('File received:', !!file);
    if (file) {
      console.log('File details:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });
    }
    
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const username = req.user?.username || 'system';
    console.log('Username:', username);
    
    const csvData = file.buffer.toString('utf-8');
    console.log('CSV data preview:', csvData.substring(0, 200) + '...');
    
    const result = await this.publishedPackageTierService.uploadFromCsv(csvData, username);
    console.log('Final result:', result);
    
    return result;
  }
}
