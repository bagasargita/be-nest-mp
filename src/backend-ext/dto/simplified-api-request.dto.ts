import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SimplifiedApiRequestDto {
  @ApiProperty({
    description: 'Backend configuration ID',
    example: '0f5a5b44-dc4f-4e14-87bf-ebe73d132f78',
  })
  @IsString()
  @IsNotEmpty()
  config_id: string;

  @ApiProperty({
    description: 'Request payload data',
    example: {
      customer: {
        name: 'PT. Sub1',
        email: 'sub1@example.com',
        msisdn: '+62214233636111',
      },
    },
  })
  @IsObject()
  @IsOptional()
  data?: any;

  @ApiProperty({
    description: 'Additional request headers (will merge with config headers)',
    required: false,
  })
  @IsObject()
  @IsOptional()
  headers?: Record<string, string>;

  @ApiProperty({
    description: 'Query parameters',
    required: false,
  })
  @IsObject()
  @IsOptional()
  params?: Record<string, any>;

  @ApiProperty({
    description: 'Override OAuth scope for this request',
    example: 'admin.internal.read admin.internal.create',
    required: false,
  })
  @IsString()
  @IsOptional()
  scope?: string;

  @ApiProperty({
    description: 'Override HTTP method from config',
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    required: false,
  })
  @IsString()
  @IsOptional()
  method?: string;

  @ApiProperty({
    description: 'Override URL from config',
    example: '/api/customer/command',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'User ID for logging purposes',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    description: 'Account ID for logging purposes',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsString()
  @IsOptional()
  account_id?: string;
}
