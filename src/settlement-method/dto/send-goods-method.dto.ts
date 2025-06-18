import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateSendGoodsMethodDto {
  @IsNumber()
  @IsNotEmpty()
  settlementMethodId: number;
}

export class UpdateSendGoodsMethodDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  settlementMethodId?: number;
}
