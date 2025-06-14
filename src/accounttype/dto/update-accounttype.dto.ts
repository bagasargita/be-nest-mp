import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountTypeDto } from './create-accounttype.dto';
import { IsString } from 'class-validator';

export class UpdateAccountTypeDto extends PartialType(CreateAccountTypeDto) {
  @IsString()
  updated_by: string;
}