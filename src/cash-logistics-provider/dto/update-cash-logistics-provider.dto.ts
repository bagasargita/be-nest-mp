import { PartialType } from '@nestjs/swagger';
import { CreateCashLogisticsProviderDto } from './create-cash-logistics-provider.dto';

export class UpdateCashLogisticsProviderDto extends PartialType(CreateCashLogisticsProviderDto) {}
