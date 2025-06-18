import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementMethodService } from './settlement-method.service';
import { SettlementMethodController } from './settlement-method.controller';
import { SettlementMethod } from './settlement-method.entity';
import { NonCashMethod } from './non-cash-method.entity';
import { CashDepositMethod } from './cash-deposit-method.entity';
import { SendMoneyMethod } from './send-money-method.entity';
import { SendGoodsMethod } from './send-good-method.entity';
import { BatchingDetail } from './batching-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SettlementMethod, 
      NonCashMethod, 
      CashDepositMethod, 
      SendMoneyMethod, 
      SendGoodsMethod,
      BatchingDetail
    ])
  ],
  controllers: [SettlementMethodController],
  providers: [SettlementMethodService],
  exports: [SettlementMethodService],
})
export class SettlementMethodModule {}