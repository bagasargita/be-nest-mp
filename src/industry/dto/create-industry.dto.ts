import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIndustryDto {
  @ApiProperty({
    description: 'Name of the industry',
    example: 'Technology',
  })
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}