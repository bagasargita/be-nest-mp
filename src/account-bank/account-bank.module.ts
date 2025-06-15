import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountBank } from './entities/account-bank.entity';
import { AccountBankService } from './account-bank.service';
import { AccountBankController } from './account-bank.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountBank])],
  providers: [AccountBankService],
  controllers: [AccountBankController],
  exports: [AccountBankService],
})
export class AccountBankModule {}