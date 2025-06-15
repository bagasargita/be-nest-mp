import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountBankDto {
  @ApiProperty({
    description: 'Unique identifier for the account bank',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  account_id: string;

  @ApiProperty({
    description: 'Bank identifier',
    example: 'bank_123',
  })
  @IsString()
  bank_id: string;

  @ApiProperty({
    description: 'Bank account number',
    example: '1234567890',
  })
  @IsString()
  bank_account_no: string;

  @ApiProperty({
    description: 'Bank Category ID',
    example: 'cat_456',
  })
  @IsOptional()
  @IsString()
  bank_category_id?: string;

  @ApiProperty({
    description: 'Bank account holder name',
    example: 'John Doe',
  })
  @IsString()
  bank_account_holder_name?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}