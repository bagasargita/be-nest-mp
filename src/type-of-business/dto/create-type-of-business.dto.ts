import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTypeOfBusinessDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsString()
  created_by: string;
}