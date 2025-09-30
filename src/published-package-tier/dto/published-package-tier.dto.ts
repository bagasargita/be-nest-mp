import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsBoolean, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePublishedPackageTierDto {
  @ApiProperty({ 
    description: 'Minimum value for the tier',
    example: 100000
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  min_value: number;

  @ApiProperty({ 
    description: 'Maximum value for the tier',
    example: 1000000
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  max_value: number;

  @ApiProperty({ 
    description: 'Fixed amount for this tier',
    example: 50000
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional({ 
    description: 'Percentage value (0-100)',
    example: 2.5
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  percentage?: number;

  @ApiProperty({ 
    description: 'Start date for this tier validity',
    example: '2025-01-01'
  })
  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @ApiProperty({ 
    description: 'End date for this tier validity',
    example: '2025-12-31'
  })
  @IsNotEmpty()
  @IsDateString()
  end_date: string;
}

export class UpdatePublishedPackageTierDto {
  @ApiPropertyOptional({ 
    description: 'Minimum value for the tier',
    example: 100000
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  min_value?: number;

  @ApiPropertyOptional({ 
    description: 'Maximum value for the tier',
    example: 1000000
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  max_value?: number;

  @ApiPropertyOptional({ 
    description: 'Fixed amount for this tier',
    example: 50000
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount?: number;

  @ApiPropertyOptional({ 
    description: 'Percentage value (0-100)',
    example: 2.5
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  percentage?: number;

  @ApiPropertyOptional({ 
    description: 'Start date for this tier validity',
    example: '2025-01-01'
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ 
    description: 'End date for this tier validity',
    example: '2025-12-31'
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ 
    description: 'Active status',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ 
    description: 'UUID from backend system',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsString()
  uuid_be?: string;
}
