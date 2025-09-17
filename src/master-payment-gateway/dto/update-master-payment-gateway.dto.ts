import { PartialType } from '@nestjs/swagger';
import { CreateMasterPaymentGatewayDto } from './create-master-payment-gateway.dto';

export class UpdateMasterPaymentGatewayDto extends PartialType(CreateMasterPaymentGatewayDto) {}
