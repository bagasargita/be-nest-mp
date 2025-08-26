import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BackendExtService } from './backend-ext.service';
import { CreateBackendExtDto } from './dto/create-backend-ext.dto';
import { UpdateBackendExtDto } from './dto/update-backend-ext.dto';
import { OAuthTokenRequestDto, OAuthTokenResponseDto, ExternalApiRequestDto } from './dto/oauth-token.dto';
import { SimplifiedApiRequestDto } from './dto/simplified-api-request.dto';
import { JwtAuthGuard } from '../infrastructure/guards/auth.guard';

@ApiTags('Backend External API')
@Controller('backend-ext')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BackendExtController {
  constructor(private readonly backendExtService: BackendExtService) {}

  // Configuration Management
  @Post()
  @ApiOperation({ 
    summary: 'Create Backend External Configuration',
    description: 'Create new external backend API configuration'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Configuration created successfully'
  })
  async create(@Body() createBackendExtDto: CreateBackendExtDto) {
    const config = await this.backendExtService.create(createBackendExtDto);
    
    return {
      success: true,
      message: 'Backend external configuration created successfully',
      data: config,
    };
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get All Backend External Configurations',
    description: 'Retrieve all external backend API configurations'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Configurations retrieved successfully'
  })
  async findAll() {
    const configs = await this.backendExtService.findAll();
    
    return {
      success: true,
      message: 'Backend external configurations retrieved successfully',
      data: configs,
    };
  }

  @Get('active')
  @ApiOperation({ 
    summary: 'Get Active Backend External Configurations',
    description: 'Retrieve only active external backend API configurations'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Active configurations retrieved successfully'
  })
  async findActive() {
    const configs = await this.backendExtService.getActiveConfigs();
    
    return {
      success: true,
      message: 'Active backend external configurations retrieved successfully',
      data: configs,
    };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get Backend External Configuration',
    description: 'Retrieve specific external backend API configuration by ID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuration retrieved successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Configuration not found'
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const config = await this.backendExtService.findOne(id);
    
    return {
      success: true,
      message: 'Backend external configuration retrieved successfully',
      data: config,
    };
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update Backend External Configuration',
    description: 'Update existing external backend API configuration'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuration updated successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Configuration not found'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBackendExtDto: UpdateBackendExtDto,
  ) {
    const config = await this.backendExtService.update(id, updateBackendExtDto);
    
    return {
      success: true,
      message: 'Backend external configuration updated successfully',
      data: config,
    };
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete Backend External Configuration',
    description: 'Delete external backend API configuration'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuration deleted successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Configuration not found'
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.backendExtService.remove(id);
    
    return {
      success: true,
      message: 'Backend external configuration deleted successfully',
    };
  }

  // OAuth Token Operations
  @Post('oauth/token')
  @ApiOperation({ 
    summary: 'Get OAuth Token',
    description: 'Obtain OAuth access token from external API using stored configuration'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'OAuth token obtained successfully',
    type: OAuthTokenResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid configuration or inactive' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Configuration not found' 
  })
  async getOAuthToken(@Body() tokenRequest: OAuthTokenRequestDto) {
    const tokenData = await this.backendExtService.getOAuthToken(tokenRequest);
    
    return {
      success: true,
      message: 'OAuth token obtained successfully',
      data: tokenData,
    };
  }

  // External API Operations
  @Post('api/simple-request')
  @ApiOperation({ 
    summary: 'Make Simplified API Request',
    description: 'Make authenticated request using config ID only. Method and URL from configuration, with optional override.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API request successful'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid token' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Configuration not found' 
  })
  async makeSimplifiedApiRequest(@Body() apiRequest: SimplifiedApiRequestDto) {
    const result = await this.backendExtService.makeSimplifiedApiRequest(apiRequest);
    
    return {
      success: true,
      message: 'Operation successful',
      data: result,
    };
  }

  @Post('api/request')
  @ApiOperation({ 
    summary: 'Make Authenticated API Request (Legacy)',
    description: 'Make authenticated request to external API using stored configuration and OAuth token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API request successful'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid token' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Configuration not found' 
  })
  async makeApiRequest(@Body() apiRequest: ExternalApiRequestDto) {
    return await this.backendExtService.makeAuthenticatedRequest(apiRequest);
  }

  // Cache Management
  @Get('cache/status')
  @ApiOperation({ 
    summary: 'Get Token Cache Status',
    description: 'Get current status of OAuth token cache for all configurations'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cache status retrieved successfully'
  })
  getCacheStatus() {
    const status = this.backendExtService.getCacheStatus();
    
    return {
      success: true,
      message: 'Token cache status retrieved successfully',
      data: status,
    };
  }

  @Delete('cache/clear/:configId')
  @ApiOperation({ 
    summary: 'Clear Token Cache for Configuration',
    description: 'Clear OAuth token cache for specific configuration'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token cache cleared successfully'
  })
  clearTokenCache(@Param('configId', ParseUUIDPipe) configId: string) {
    this.backendExtService.clearTokenCacheForConfig(configId);
    
    return {
      success: true,
      message: `Token cache cleared for configuration: ${configId}`,
    };
  }

  @Delete('cache/clear-all')
  @ApiOperation({ 
    summary: 'Clear All Token Cache',
    description: 'Clear all OAuth token cache for all configurations'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'All token cache cleared successfully'
  })
  clearAllTokenCache() {
    this.backendExtService.clearAllTokenCache();
    
    return {
      success: true,
      message: 'All token cache cleared successfully',
    };
  }

  // Transaction Logs
  @Get('logs/:configId')
  @ApiOperation({ 
    summary: 'Get Transaction Logs',
    description: 'Retrieve transaction logs for a specific backend external configuration'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Transaction logs retrieved successfully'
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of logs to retrieve (default: 50)' })
  @ApiQuery({ name: 'offset', required: false, description: 'Number of logs to skip (default: 0)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date filter (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date filter (ISO string)' })
  @ApiQuery({ name: 'status', required: false, description: 'HTTP response status filter' })
  async getTransactionLogs(
    @Param('configId', ParseUUIDPipe) configId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
  ) {
    const options = {
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status: status ? parseInt(status) : undefined,
    };

    const result = await this.backendExtService.getTransactionLogs(configId, options);
    
    return {
      success: true,
      message: 'Transaction logs retrieved successfully',
      data: result,
    };
  }

  // Test Operations
  @Post('test-connection')
  @ApiOperation({ 
    summary: 'Test External API Connection',
    description: 'Test connection to external API with OAuth authentication using stored configuration'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Connection test completed'
  })
  async testConnection(@Body() testRequest: { 
    config_id: string; 
    test_endpoint?: string;
    scope?: string;
  }) {
    try {
      // First get OAuth token
      const tokenRequest: OAuthTokenRequestDto = { 
        config_id: testRequest.config_id,
        scope: testRequest.scope
      };
      const token = await this.backendExtService.getOAuthToken(tokenRequest);
      
      // Then make a simple test request
      const testApiRequest: ExternalApiRequestDto = {
        config_id: testRequest.config_id,
        method: 'GET',
        url: testRequest.test_endpoint || '/api/health', // Default health check endpoint
        scope: testRequest.scope,
      };

      const response = await this.backendExtService.makeAuthenticatedRequest(testApiRequest);

      return {
        success: true,
        message: 'External API connection test completed successfully',
        data: {
          tokenObtained: !!token.access_token,
          tokenType: token.token_type,
          expiresIn: token.expires_in,
          apiTestResult: response,
        },
      };

    } catch (error) {
      return {
        success: false,
        message: 'External API connection test failed',
        data: {
          error: error.message,
          details: error.response?.data || null,
        },
      };
    }
  }
}