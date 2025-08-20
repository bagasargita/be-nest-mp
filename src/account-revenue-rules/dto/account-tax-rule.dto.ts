import { IsString, IsOptional, IsUUID, IsBoolean, IsNumber, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountTaxRuleDto {
  @ApiProperty({ description: 'Account ID' })
  @IsUUID()
  account_id: string;

  @ApiProperty({ description: 'Tax type', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  type: string;

  @ApiProperty({ description: 'Tax rate percentage (0-100)', minimum: 0, maximum: 100 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  rate: number;

  @ApiProperty({ description: 'Tax rule description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateAccountTaxRuleDto {
  @ApiProperty({ description: 'Tax type', maxLength: 50, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @ApiProperty({ description: 'Tax rate percentage (0-100)', minimum: 0, maximum: 100, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  rate?: number;

  @ApiProperty({ description: 'Tax rule description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Active status', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
