import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePositionDto {
  @ApiProperty({
    description: 'Name of the position',
    example: 'Software Engineer',
  })
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // @IsString()
  // created_by: string;
}