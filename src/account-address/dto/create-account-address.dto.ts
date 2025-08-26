import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountAddressDto {
  @ApiProperty({ 
    description: 'Unique identifier for the account address',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  account_id: string;

  @ApiProperty({ 
    description: 'Primary address line',
    example: '123 Main St'
  })
  @IsString()
  address1: string;

  @ApiProperty({ 
    description: 'Secondary address line (optional)',
    example: 'Apt 4B',
    required: false
  })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({ 
    description: 'Sub-district or neighborhood',
    example: 'Downtown'
  })
  @IsString()
  sub_district: string;

  @ApiProperty({ 
    description: 'District or administrative division',
    example: 'Central District'
  })
  @IsString()
  district: string;

  @ApiProperty({ 
    description: 'City or locality',
    example: 'Metropolis'
  })
  @IsString()
  city: string;

  @ApiProperty({ 
    description: 'Province or state',
    example: 'Gotham'
  })
  @IsString()
  province: string;

  @ApiProperty({ 
    description: 'Postal code or ZIP code',
    example: '12345',
    required: false
  })
  @IsOptional()
  @IsString()
  postalcode: string;

  @ApiProperty({ 
    description: 'Country name',
    example: 'United States'
  })
  @IsString()
  country: string;

  @ApiProperty({ 
    description: 'Latitude coordinate for the address',
    example: 40.7128,
    required: false
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ 
    description: 'Longitude coordinate for the address',
    example: -74.0060,
    required: false
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ 
    description: 'Phone number associated with the address',
    example: '6234567890',
    required: false
  })
  @IsOptional()
  @IsString()
  phone_no?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}