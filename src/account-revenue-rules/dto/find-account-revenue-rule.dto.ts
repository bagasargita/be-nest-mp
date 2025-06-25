import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAccountRevenueRuleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  account_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  account_service_id: string;
}