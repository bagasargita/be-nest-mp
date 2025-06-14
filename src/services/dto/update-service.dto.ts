import { IsString, IsOptional, IsUUID } from 'class-validator';
import { CreateServiceDto } from './create-service.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsOptional()
  @IsUUID()
  id?: string;
} 