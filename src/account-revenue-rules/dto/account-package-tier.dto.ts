import { IsNotEmpty, IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAccountPackageTierDto {
  @ApiProperty({ description: 'Account ID' })
  @IsNotEmpty()
  @IsString()
  account_id: string;

  @ApiProperty({ description: 'Minimum value for tier', type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  min_value: number;

  @ApiProperty({ description: 'Maximum value for tier', type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  max_value: number;

  @ApiProperty({ description: 'Amount for this tier', type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiProperty({ description: 'Start date for tier validity', type: 'string', format: 'date' })
  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @ApiProperty({ description: 'End date for tier validity', type: 'string', format: 'date' })
  @IsNotEmpty()
  @IsDateString()
  end_date: string;
}

export class UpdateAccountPackageTierDto {
  @ApiProperty({ description: 'Minimum value for tier', type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  min_value?: number;

  @ApiProperty({ description: 'Maximum value for tier', type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  max_value?: number;

  @ApiProperty({ description: 'Amount for this tier', type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount?: number;

  @ApiProperty({ description: 'Start date for tier validity', type: 'string', format: 'date', required: false })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({ description: 'End date for tier validity', type: 'string', format: 'date', required: false })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
