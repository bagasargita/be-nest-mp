
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterPaymentGateway } from './entities/master-payment-gateway.entity';
import { MasterPaymentGatewayService } from './master-payment-gateway.service';
import { MasterPaymentGatewayController } from './master-payment-gateway.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MasterPaymentGateway])],
  controllers: [MasterPaymentGatewayController],
  providers: [MasterPaymentGatewayService],
})
export class MasterPaymentGatewayModule {}
