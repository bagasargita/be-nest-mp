import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateNonCashMethodDto {
  @IsNumber()
  @IsNotEmpty()
  settlementMethodId: number;
}

export class UpdateNonCashMethodDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  settlementMethodId?: number;
}
