import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIndustryDto {
  @ApiProperty({
    description: 'Code of the industry',
    example: 'TECH',
  })
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty({
    description: 'Name of the industry',
    example: 'Technology',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the industry',
    example: 'Industry related to technology and software development',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Whether the industry is active',
    example: true,
    required: true,
  })
  @IsBoolean()
  is_active: boolean;
}