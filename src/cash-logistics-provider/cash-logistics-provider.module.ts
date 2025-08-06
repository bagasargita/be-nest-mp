import { Module } from '@nestjs/common';
import { CashLogisticsProviderService } from './cash-logistics-provider.service';
import { CashLogisticsProviderController } from './cash-logistics-provider.controller';

@Module({
  controllers: [CashLogisticsProviderController],
  providers: [CashLogisticsProviderService],
})
export class CashLogisticsProviderModule {}
