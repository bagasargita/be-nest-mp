import { PartialType } from '@nestjs/swagger';
import { CreateAccountReferralDto } from './create-account-referral.dto';

export class UpdateAccountReferralDto extends PartialType(CreateAccountReferralDto) {}
