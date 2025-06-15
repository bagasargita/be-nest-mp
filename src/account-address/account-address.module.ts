import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountAddress } from './entities/account-address.entity';
import { AccountAddressService } from './account-address.service';
import { AccountAddressController } from './account-address.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountAddress])],
  providers: [AccountAddressService],
  controllers: [AccountAddressController],
  exports: [AccountAddressService],
})
export class AccountAddressModule {}