import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAccountAddOnsDto {
  @IsOptional()
  @IsString()
  id?: string; // For updates

  @IsNotEmpty()
  @IsString()
  account_id: string;

  @IsOptional()
  @IsString()
  billing_method_id?: string; // FK to m_account_billing_method

  @IsEnum(['system_integration', 'infrastructure'])
  add_ons_type: 'system_integration' | 'infrastructure';

  @IsEnum(['otc', 'monthly'])
  billing_type: 'otc' | 'monthly';

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // System Integration specific fields
  @IsOptional()
  @IsString()
  api_type?: string;

  @IsOptional()
  @IsString()
  complexity_level?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  base_fee?: number;

  @IsOptional()
  @IsBoolean()
  requires_custom_development?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  custom_development_fee?: number;

  @IsOptional()
  @IsString()
  billing_method_type?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  custom_fee?: number;

  // Infrastructure specific fields
  @IsOptional()
  @IsString()
  infrastructure_type?: string;

  @IsOptional()
  @IsString()
  resource_size?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  monthly_fee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  setup_fee?: number;

  @IsOptional()
  @IsBoolean()
  is_scalable?: boolean;
}

export class UpdateAccountAddOnsDto extends PartialType(CreateAccountAddOnsDto) {
  @IsOptional()
  @IsString()
  account_id?: string;
}
