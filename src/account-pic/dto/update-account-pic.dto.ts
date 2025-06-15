import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountPICDto } from './create-account-pic.dto';

export class UpdateAccountPICDto extends PartialType(CreateAccountPICDto) {}