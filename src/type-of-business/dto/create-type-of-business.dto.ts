import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
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

  @ApiProperty(
    {
      description: 'Parent type of business ID',
      example: 'uuid-string',
      required: false,
    }
  )
  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @ApiProperty(
    {
      description: 'Is this an "Other" type that allows free text input',
      example: false,
      required: false,
    }
  )
  @IsOptional()
  @IsBoolean()
  is_other?: boolean;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}