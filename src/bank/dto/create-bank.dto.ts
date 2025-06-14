import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBankDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsString()
  created_by: string;
}