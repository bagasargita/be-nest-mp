// update-account-category.dto.ts

import { PartialType } from '@nestjs/swagger';
import { CreateAccountCategoryDto } from './create-account-category.dto';

// Hapus properti yang tidak seharusnya diupdate oleh user.
// Properti `name` dan `is_active` sudah di-handle oleh PartialType.
export class UpdateAccountCategoryDto extends PartialType(CreateAccountCategoryDto) {}