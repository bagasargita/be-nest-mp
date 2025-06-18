import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBatchingDetailDto } from './batching-detail.dto';

export type CashDepositType = 'ByTransaction' | 'ByBatching';

export class CreateCashDepositMethodDto {
  @IsEnum(['ByTransaction', 'ByBatching'])
  type: CashDepositType;

  @IsNotEmpty()
  settlementMethodId: number;

  @ValidateNested()
  @Type(() => CreateBatchingDetailDto)
  @IsOptional()
  batchingDetail?: CreateBatchingDetailDto;
}

export class UpdateCashDepositMethodDto {
  @IsEnum(['ByTransaction', 'ByBatching'])
  @IsOptional()
  type?: CashDepositType;

  @IsOptional()
  settlementMethodId?: number;

  @ValidateNested()
  @Type(() => CreateBatchingDetailDto)
  @IsOptional()
  batchingDetail?: CreateBatchingDetailDto;
}
