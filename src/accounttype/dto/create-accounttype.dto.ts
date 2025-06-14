import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAccountTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsString()
  created_by: string;
}