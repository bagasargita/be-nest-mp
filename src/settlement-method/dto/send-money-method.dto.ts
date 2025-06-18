import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateSendMoneyMethodDto {
  @IsNumber()
  @IsNotEmpty()
  settlementMethodId: number;
}

export class UpdateSendMoneyMethodDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  settlementMethodId?: number;
}
