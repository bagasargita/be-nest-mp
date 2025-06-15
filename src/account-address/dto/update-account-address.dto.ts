import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountAddressDto } from './create-account-address.dto';

export class UpdateAccountAddressDto extends PartialType(CreateAccountAddressDto) {}