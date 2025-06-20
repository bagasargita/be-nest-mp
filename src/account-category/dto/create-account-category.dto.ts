import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
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

  @ApiPropertyOptional({
    description: 'Parent account category ID (for tree structure)',
    example: 'b1e7e8c2-1234-4cde-9e1a-123456789abc',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}