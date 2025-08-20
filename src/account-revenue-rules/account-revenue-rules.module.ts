import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRevenueRule } from './entities/account-revenue-rule.entity';
import { AccountRevenueRuleService } from './account-revenue-rules.service';
import { AccountRevenueRuleController } from './account-revenue-rules.controller';
import { AccountModule } from 'src/account/account.module';
import { AccountServiceModule } from 'src/account-service/account-service.module';
import { AccountRevenueRuleTree } from './entities/account-revenue-rule-tree.entity';
import { AccountPackageTier } from './entities/account-package-tier.entity';
import { AccountPackageTierService } from './account-package-tier.service';
import { AccountBillingMethod } from './entities/account-billing-method.entity';
import { AccountTaxRule } from './entities/account-tax-rule.entity';
import { AccountTermOfPayment } from './entities/account-term-of-payment.entity';
import { AccountAddOns } from './entities/account-add-ons.entity';
import { AccountBillingMethodService } from './account-billing-method.service';
import { AccountTaxRuleService } from './account-tax-rule.service';
import { AccountTermOfPaymentService } from './account-term-of-payment.service';
import { AccountAddOnsService } from './account-add-ons.service';
// import { AccountService } from 'src/account/account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountRevenueRule, 
      AccountRevenueRuleTree, 
      AccountPackageTier,
      AccountBillingMethod,
      AccountTaxRule,
      AccountTermOfPayment,
      AccountAddOns
    ]),
    AccountModule,
    AccountServiceModule,
  ],
  controllers: [AccountRevenueRuleController],
  providers: [
    AccountRevenueRuleService, 
    AccountPackageTierService,
    AccountBillingMethodService,
    AccountTaxRuleService,
    AccountTermOfPaymentService,
    AccountAddOnsService
  ],
  exports: [
    AccountRevenueRuleService, 
    AccountPackageTierService,
    AccountBillingMethodService,
    AccountTaxRuleService,
    AccountTermOfPaymentService,
    AccountAddOnsService
  ],
})
export class AccountRevenueRulesModule {}
