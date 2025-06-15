import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTypeOfBusinessDto {
  @ApiProperty(
    {
      description: 'Name of the type of business',
      example: 'Corporate',
    }
  )
  @IsString()
  name: string;

  @ApiProperty(
    {
      description: 'Detail of the type of business',
      example: 'A type of business that is incorporated and has a separate legal identity.',
      required: false,
    }
  )
  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}