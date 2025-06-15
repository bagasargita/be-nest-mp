import { PartialType } from '@nestjs/mapped-types';
import { CreateBankCategoryDto } from './create-bank-category.dto';

export class UpdateBankCategoryDto extends PartialType(CreateBankCategoryDto) {}