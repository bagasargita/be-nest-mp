import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountTypeDto {
  @ApiProperty({
    description: 'Name of the account type',
    example: 'Parent',
  })
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // @IsString()
  // created_by: string;
}