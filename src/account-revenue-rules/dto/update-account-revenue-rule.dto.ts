import { PartialType } from '@nestjs/swagger';
import { CreateAccountRevenueRuleDto } from './create-account-revenue-rule.dto';

export class UpdateAccountRevenueRuleDto extends PartialType(CreateAccountRevenueRuleDto) {}
