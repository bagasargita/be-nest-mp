import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './entities/account-service.entity';
import { AccountServiceService } from './account-service.service';
import { AccountServiceController } from './account-service.controller';

@Module({
  imports : [TypeOrmModule.forFeature([AccountService])],
  controllers: [AccountServiceController],
  providers: [AccountServiceService],
  exports: [AccountServiceService],
})
export class AccountServiceModule {}
