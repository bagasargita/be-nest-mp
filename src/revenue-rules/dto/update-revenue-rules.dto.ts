import { CreateRevenueRuleDto } from './create-revenue-rules.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRevenueRuleDto extends PartialType(CreateRevenueRuleDto) {}