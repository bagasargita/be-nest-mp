import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRevenueRule } from './entities/account-revenue-rule.entity';
import { AccountRevenueRuleService } from './account-revenue-rules.service';
import { AccountRevenueRuleController } from './account-revenue-rules.controller';
import { AccountModule } from 'src/account/account.module';
import { AccountServiceModule } from 'src/account-service/account-service.module';
import { AccountRevenueRuleTree } from './entities/account-revenue-rule-tree.entity';
// import { AccountService } from 'src/account/account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountRevenueRule, AccountRevenueRuleTree]),
    AccountModule,
    AccountServiceModule,
  ],
  controllers: [AccountRevenueRuleController],
  providers: [AccountRevenueRuleService],
  exports: [AccountRevenueRuleService],
})
export class AccountRevenueRulesModule {}
