import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDate, IsArray, IsObject } from 'class-validator';

export class CreateTransactionDepositDto {
  @ApiProperty({ description: 'Transaction code', example: 'bv710m4dq6q28a111u35' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Total deposit amount', example: 50000 })
  @IsNumber()
  total_deposit: number;

  @ApiProperty({ description: 'Charging fee', example: 0 })
  @IsNumber()
  charging_fee: number;

  @ApiProperty({ description: 'Total transfer amount', example: 50000 })
  @IsNumber()
  total_transfer: number;

  @ApiProperty({ description: 'Transaction status', example: 'SUCCESS' })
  @IsString()
  transaction_status: string;

  @ApiProperty({ description: 'Machine info', example: 'Toko Mamang', required: false })
  @IsOptional()
  @IsString()
  machine_info?: string;

  @ApiProperty({ description: 'Machine ID', example: '07f74568-c6c7-4ffe-85de-63402702bacb', required: false })
  @IsOptional()
  @IsString()
  machine_id?: string;

  @ApiProperty({ description: 'CDM Transaction Number', example: 'KSN002250704145100031', required: false })
  @IsOptional()
  @IsString()
  cdm_trx_no?: string;

  @ApiProperty({ description: 'CDM Transaction Date', required: false })
  @IsOptional()
  @IsDate()
  cdm_trx_date?: Date;

  @ApiProperty({ description: 'CDM Transaction Time', example: '14:52:28', required: false })
  @IsOptional()
  @IsString()
  cdm_trx_time?: string;

  @ApiProperty({ description: 'CDM Transaction DateTime', required: false })
  @IsOptional()
  @IsDate()
  cdm_trx_date_time?: Date;

  @ApiProperty({ description: 'Jam Posting', required: false })
  @IsOptional()
  @IsDate()
  jam_posting?: Date;

  @ApiProperty({ description: 'Denominations array', required: false })
  @IsOptional()
  @IsArray()
  denominations?: any[];

  @ApiProperty({ description: 'User object', required: false })
  @IsOptional()
  @IsObject()
  user?: any;

  @ApiProperty({ description: 'Customer object', required: false })
  @IsOptional()
  @IsObject()
  customer?: any;

  @ApiProperty({ description: 'Beneficiary account object', required: false })
  @IsOptional()
  @IsObject()
  beneficiary_account?: any;

  @ApiProperty({ description: 'Machine object', required: false })
  @IsOptional()
  @IsObject()
  machine?: any;

  @ApiProperty({ description: 'Service product object', required: false })
  @IsOptional()
  @IsObject()
  service_product?: any;

  @ApiProperty({ description: 'PJPUR status object', required: false })
  @IsOptional()
  @IsObject()
  pjpur_status?: any;

  @ApiProperty({ description: 'Gateway status object', required: false })
  @IsOptional()
  @IsObject()
  gateway_status?: any;
}

