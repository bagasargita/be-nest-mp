import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentGatewayCategory } from '../entities/master-payment-gateway.entity';

export class CreateMasterPaymentGatewayDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEnum(PaymentGatewayCategory)
	category: PaymentGatewayCategory;

	@IsOptional()
	is_active?: boolean;

    @IsString()
    @IsNotEmpty()
    created_by: string;

    @IsDate()
    @IsOptional()
    created_at?: Date;
}
