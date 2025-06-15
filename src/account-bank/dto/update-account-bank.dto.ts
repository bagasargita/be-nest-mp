import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountBankDto } from './create-account-bank.dto';

export class UpdateAccountBankDto extends PartialType(CreateAccountBankDto) {}