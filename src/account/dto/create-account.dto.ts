import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Unique identifier for the account',
    example: 'acc_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  account_no?: string;

  @ApiProperty({
    description: 'Name of the account',
    example: 'Tech Innovations Ltd.',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Brand name of the account',
    example: 'ABC Tech',
    required: false,
  })
  @IsOptional()
  @IsString()
  brand_name?: string;

  @ApiProperty({
    description: 'Industry ID associated with the account',
    example: 'ind_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  industry_id?: string;

  @ApiProperty({
    description: 'Type of business ID associated with the account',
    example: 'type_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  type_of_business_id?: string;

  @ApiProperty({
    description: 'Account type ID associated with the account', 
    example: 'type_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  account_type_id?: string;

  @ApiProperty({
    description: 'Account category ID associated with the account',
    example: 'cat_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  account_category_id?: string;

  @ApiProperty({
    description: 'Parent account ID if this account is a sub-account',
    example: 'parent_acc_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  parent_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}