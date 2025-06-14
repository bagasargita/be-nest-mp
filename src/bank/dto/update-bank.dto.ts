import { PartialType } from '@nestjs/mapped-types';
import { CreateBankDto } from './create-bank.dto';
import { IsString } from 'class-validator';

export class UpdateBankDto extends PartialType(CreateBankDto) {
  @IsString()
  updated_by: string;
}