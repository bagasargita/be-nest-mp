import { IsArray, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AccountRuleDto {
  @ApiProperty({ example: 'charging_metric' })
  @IsNotEmpty()
  @IsString()
  rule_category: string;

  @ApiProperty({ example: 'type.dedicated.package' })
  @IsNotEmpty()
  @IsString()
  rule_path: string;

  @ApiProperty({ example: 'true' })
  @IsNotEmpty()
  @IsString()
  rule_value: string;
}

export class CreateAccountRevenueRuleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  account_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  account_service_id: string;

  @ApiProperty({ type: [AccountRuleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccountRuleDto)
  rules: AccountRuleDto[];
}