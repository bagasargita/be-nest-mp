import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { TransactionDepositService } from './transaction-deposit.service';
import { TransactionDepositController } from './transaction-deposit.controller';
import { TransactionDeposit } from './entities/transaction-deposit.entity';
import { BackendExtModule } from '../backend-ext/backend-ext.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionDeposit]),
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 5,
    }),
    BackendExtModule,
  ],
  controllers: [TransactionDepositController],
  providers: [TransactionDepositService],
  exports: [TransactionDepositService],
})
export class TransactionDepositModule {}

