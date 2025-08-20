import { IsString, IsOptional, IsUUID, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountBillingMethodDto {
  @ApiProperty({ description: 'ID of existing record for updates', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Account ID' })
  @IsUUID()
  account_id: string;

  @ApiProperty({ description: 'Billing method name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  method: string;

  @ApiProperty({ description: 'Method description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateAccountBillingMethodDto {
  @ApiProperty({ description: 'Billing method name', maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  method?: string;

  @ApiProperty({ description: 'Method description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Active status', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
