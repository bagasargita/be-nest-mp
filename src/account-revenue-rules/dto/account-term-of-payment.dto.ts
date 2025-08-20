import { IsString, IsOptional, IsUUID, IsBoolean, IsNumber, Min, Max, MaxLength, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountTermOfPaymentDto {
  @ApiProperty({ description: 'Account ID' })
  @IsUUID()
  account_id: string;

  @ApiProperty({ description: 'Payment term name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  payment_term: string;

  @ApiProperty({ description: 'Due days', minimum: 1 })
  @IsInt()
  @Min(1)
  due_days: number;

  @ApiProperty({ description: 'Late fee rate percentage (0-100)', minimum: 0, maximum: 100, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  late_fee_rate?: number;

  @ApiProperty({ description: 'Grace period in days', minimum: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  grace_period?: number;
}

export class UpdateAccountTermOfPaymentDto {
  @ApiProperty({ description: 'Payment term name', maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  payment_term?: string;

  @ApiProperty({ description: 'Due days', minimum: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  due_days?: number;

  @ApiProperty({ description: 'Late fee rate percentage (0-100)', minimum: 0, maximum: 100, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  late_fee_rate?: number;

  @ApiProperty({ description: 'Grace period in days', minimum: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  grace_period?: number;

  @ApiProperty({ description: 'Active status', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
