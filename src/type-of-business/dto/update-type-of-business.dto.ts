import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeOfBusinessDto } from './create-type-of-business.dto';
import { IsString } from 'class-validator';

export class UpdateTypeOfBusinessDto extends PartialType(CreateTypeOfBusinessDto) {
  @IsString()
  updated_by: string;
}