import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBackendExtDto {
  @ApiProperty({
    description: 'Configuration name',
    example: 'Main External API',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'External API base URL',
    example: 'http://test-stg01.merahputih-id.tech:5002',
  })
  @IsString()
  @IsNotEmpty()
  base_url: string;

  @ApiProperty({
    description: 'OAuth token URL (if different from base_url)',
    example: 'http://test-stg01.merahputih-id.tech:9002/oauth/token',
    required: false,
  })
  @IsString()
  @IsOptional()
  token_url?: string;

  @ApiProperty({
    description: 'OAuth Client ID',
    example: 'bmp-admin-credential-id',
  })
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({
    description: 'OAuth Client Secret',
    example: 'bmp-admin-credential-secret',
  })
  @IsString()
  @IsNotEmpty()
  client_secret: string;

  @ApiProperty({
    description: 'Default OAuth scope',
    example: 'customer.internal.read customer.internal.create',
    required: false,
  })
  @IsString()
  @IsOptional()
  default_scope?: string;

  @ApiProperty({
    description: 'Configuration description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Is configuration active',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    default: 3600,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  token_expires_in?: number;

  @ApiProperty({
    description: 'Additional headers for API requests',
    required: false,
  })
  @IsObject()
  @IsOptional()
  additional_headers?: Record<string, string>;

  @ApiProperty({
    description: 'HTTP method for API requests',
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    default: 'GET',
    required: false,
  })
  @IsString()
  @IsOptional()
  method?: string;

  @ApiProperty({
    description: 'API endpoint URL (relative to base_url)',
    example: '/api/customer/command',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;
}