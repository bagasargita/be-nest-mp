import { PartialType } from '@nestjs/mapped-types';
import { CreateBankCategoryDto } from './create-bank-category.dto';
import { IsString } from 'class-validator';

export class UpdateBankCategoryDto extends PartialType(CreateBankCategoryDto) {
  @IsString()
  updated_by: string;
}