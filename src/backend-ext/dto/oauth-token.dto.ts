import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OAuthTokenRequestDto {
  @ApiProperty({
    description: 'Backend configuration ID',
    example: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  config_id: string;

  @ApiProperty({
    description: 'OAuth grant type',
    example: 'client_credentials',
    default: 'client_credentials',
    required: false,
  })
  @IsString()
  @IsOptional()
  grant_type?: string;

  @ApiProperty({
    description: 'Custom scope (override default)',
    required: false,
  })
  @IsString()
  @IsOptional()
  scope?: string;
}

export class OAuthTokenResponseDto {
  @ApiProperty({
    description: 'Access Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Token Type',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Expires In (seconds)',
    example: 3600,
  })
  expires_in: number;

  @ApiProperty({
    description: 'Scope',
    example: 'customer.internal.read customer.internal.create',
  })
  scope: string;

  @ApiProperty({
    description: 'Token Expiry Timestamp',
    example: 1234567890,
  })
  expires_at?: number;
}

export class ExternalApiRequestDto {
  @ApiProperty({
    description: 'Backend configuration ID',
    example: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  config_id: string;

  @ApiProperty({
    description: 'HTTP Method',
    example: 'GET',
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
  @IsString()
  @IsNotEmpty()
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

  @ApiProperty({
    description: 'API Endpoint URL (relative to base_url)',
    example: '/api/customers',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Request Body (for POST/PUT requests)',
    required: false,
  })
  @IsOptional()
  data?: any;

  @ApiProperty({
    description: 'Additional Headers',
    required: false,
  })
  @IsOptional()
  headers?: Record<string, string>;

  @ApiProperty({
    description: 'Query Parameters',
    required: false,
  })
  @IsOptional()
  params?: Record<string, any>;

  @ApiProperty({
    description: 'Custom OAuth scope for this request',
    required: false,
  })
  @IsString()
  @IsOptional()
  scope?: string;
}