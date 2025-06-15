import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountAddressModule } from '../account-address/account-address.module';
import { AccountPICModule } from '../account-pic/account-pic.module';
import { AccountBankModule } from '../account-bank/account-bank.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]), 
    AccountAddressModule,
    AccountPICModule,
    AccountBankModule,],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}