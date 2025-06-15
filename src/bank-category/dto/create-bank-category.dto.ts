import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBankCategoryDto {
  @ApiProperty({
    description: 'Name of the bank category',
    example: 'Origin',
  })
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}