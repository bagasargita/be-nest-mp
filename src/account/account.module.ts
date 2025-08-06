import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from './entities/account.entity';
import { AccountReferral } from './entities/account-referral.entity';
import { TypeOfBusiness } from '../type-of-business/entities/type-of-business.entity';
import { Industry } from '../industry/entities/industry.entity';
import { AccountType } from '../accounttype/entities/accounttype.entity';
import { AccountCategory } from '../account-category/entities/account-category.entity';
import { AccountAddressModule } from '../account-address/account-address.module';
import { AccountPICModule } from '../account-pic/account-pic.module';
import { AccountBankModule } from '../account-bank/account-bank.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      AccountReferral,
      TypeOfBusiness,
      Industry,
      AccountType,
      AccountCategory
    ]),
    AccountAddressModule,
    AccountPICModule,
    AccountBankModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}