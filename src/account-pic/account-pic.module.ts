import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountPIC } from './entities/account-pic.entity';
import { AccountPICService } from './account-pic.service';
import { AccountPICController } from './account-pic.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountPIC])],
  providers: [AccountPICService],
  controllers: [AccountPICController],
  exports: [AccountPICService],
})
export class AccountPICModule {}