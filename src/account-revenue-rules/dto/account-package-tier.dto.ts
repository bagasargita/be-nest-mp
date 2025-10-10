import { IsNotEmpty, IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAccountPackageTierDto {
  @ApiProperty({ description: 'ID of existing record for updates', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Account ID' })
  @IsNotEmpty()
  @IsString()
  account_id: string;

  @ApiProperty({ description: 'Billing Method ID - FK to m_account_billing_method', required: false })
  @IsOptional()
  @IsString()
  billing_method_id?: string;

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

  @ApiProperty({ description: 'Active status', required: false, default: true })
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ description: 'UUID from backend system', required: false, nullable: true })
  @IsOptional()
  @IsString()
  uuid_be?: string;

  @ApiProperty({ description: 'Percentage status', required: false, default: false })
  @IsOptional()
  percentage?: boolean;
}

export class UpdateAccountPackageTierDto {
  @ApiProperty({ description: 'Billing Method ID - FK to m_account_billing_method', required: false })
  @IsOptional()
  @IsString()
  billing_method_id?: string;

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

  @ApiProperty({ description: 'Active status', required: false, default: true })
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ description: 'UUID from backend system', required: false, nullable: true })
  @IsOptional()
  @IsString()
  uuid_be?: string;

  @ApiProperty({ description: 'Percentage status', required: false, default: false })
  @IsOptional()
  percentage?: boolean;
}
