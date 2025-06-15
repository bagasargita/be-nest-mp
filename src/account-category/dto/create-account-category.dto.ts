// create-account-category.dto.ts

import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAccountCategoryDto {
  @ApiProperty({
    description: 'Name of the account category',
    example: 'Customer',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Active status of the account category. Defaults to true if not provided.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // HAPUS Properti `created_by` dari DTO.
  // @IsOptional()
  // @IsString()
  // created_by: string;
}