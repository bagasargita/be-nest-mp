import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountType } from './entities/accounttype.entity';
import { AccountTypeService } from './accounttype.service';
import { AccountTypeController } from './accounttype.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountType]),
  ],
  controllers: [AccountTypeController],
  providers: [AccountTypeService],
  exports: [AccountTypeService],
})
export class AccountTypeModule {}
