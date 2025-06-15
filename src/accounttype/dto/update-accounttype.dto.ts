import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountTypeDto } from './create-accounttype.dto';

export class UpdateAccountTypeDto extends PartialType(CreateAccountTypeDto) {}