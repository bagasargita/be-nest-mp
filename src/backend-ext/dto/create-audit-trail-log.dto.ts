import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateAuditTrailLogDto {
  @ApiProperty({ 
    description: 'Application name identifier',
    example: 'merahputih-app',
    default: 'merahputih-app'
  })
  @IsOptional()
  @IsString()
  app_name?: string;

  @ApiProperty({ 
    description: 'Feature or module name',
    example: 'machine-management',
    required: false
  })
  @IsOptional()
  @IsString()
  feature_name?: string;

  @ApiProperty({ 
    description: 'HTTP method used for the request',
    example: 'POST',
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  })
  @IsString()
  method: string;

  @ApiProperty({ 
    description: 'Full URL that was called',
    example: 'https://api.external.com/machines'
  })
  @IsString()
  url: string;

  @ApiProperty({ 
    description: 'API endpoint path only',
    example: '/api/machines',
    required: false
  })
  @IsOptional()
  @IsString()
  endpoint?: string;

  @ApiProperty({ 
    description: 'Request body data (will be stored as JSON)',
    example: { name: 'Machine 1', type: 'ATM' },
    required: false
  })
  @IsOptional()
  request_data?: any;

  @ApiProperty({ 
    description: 'Request parameters or headers',
    example: { page: 1, limit: 10 },
    required: false
  })
  @IsOptional()
  request_params?: any;

  @ApiProperty({ 
    description: 'HTTP response status code',
    example: 200,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(599)
  response_status?: number;

  @ApiProperty({ 
    description: 'Response data from external API',
    example: { success: true, data: { id: 1, name: 'Machine 1' } },
    required: false
  })
  @IsOptional()
  response_data?: any;

  @ApiProperty({ 
    description: 'Error message if request failed',
    example: 'Connection timeout',
    required: false
  })
  @IsOptional()
  @IsString()
  error_message?: string;

  @ApiProperty({ 
    description: 'Request execution time in milliseconds',
    example: 1500,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  execution_time_ms?: number;

  @ApiProperty({ 
    description: 'User agent string from browser',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false
  })
  @IsOptional()
  @IsString()
  user_agent?: string;

  @ApiProperty({ 
    description: 'Client IP address',
    example: '192.168.1.100',
    required: false
  })
  @IsOptional()
  @IsString()
  ip_address?: string;

  @ApiProperty({ 
    description: 'User session identifier',
    example: 'sess_abc123def456',
    required: false
  })
  @IsOptional()
  @IsString()
  session_id?: string;
}