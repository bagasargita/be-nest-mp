import { PartialType } from '@nestjs/swagger';
import { CreateAccountServiceDto } from './create-account-service.dto';

export class UpdateAccountServiceDto extends PartialType(CreateAccountServiceDto) {}
