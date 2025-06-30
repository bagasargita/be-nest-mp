import { IsArray, IsNotEmpty, IsString, IsUUID, ValidateNested, IsOptional, IsNumber, IsBoolean, IsIn, Min, Max } from 'class-validator';
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

// Tree Structure DTOs

export class PackageTierDto {
  @ApiProperty({ example: 100000 })
  @IsNumber()
  @Min(0)
  min: number;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @Min(0)
  max: number;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class PackageDto {
  @ApiProperty({ type: [PackageTierDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageTierDto)
  tiers: PackageTierDto[];
}

export class AddOnTypeDto {
  @ApiProperty({ example: 'system_integration', enum: ['system_integration', 'infrastructure'] })
  @IsString()
  @IsIn(['system_integration', 'infrastructure'])
  type: string;

  @ApiProperty({ example: 'monthly', enum: ['otc', 'monthly'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['otc', 'monthly'])
  billing_type?: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class DedicatedTierDto {
  @ApiProperty({ example: 'package', enum: ['package', 'non_package'] })
  @IsString()
  @IsIn(['package', 'non_package'])
  type: string;

  @ApiProperty({ type: PackageDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PackageDto)
  package?: PackageDto;

  @ApiProperty({ example: 'machine_only', enum: ['machine_only', 'service_only'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['machine_only', 'service_only'])
  non_package_type?: string;

  @ApiProperty({ example: 100000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  has_add_ons?: boolean;

  @ApiProperty({ type: [AddOnTypeDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddOnTypeDto)
  add_ons_types?: AddOnTypeDto[];
}

export class DedicatedDto {
  @ApiProperty({ type: [DedicatedTierDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DedicatedTierDto)
  tiers: DedicatedTierDto[];
}

export class NonDedicatedTierDto {
  @ApiProperty({ example: 'transaction_fee', enum: ['transaction_fee', 'subscription', 'add_ons'] })
  @IsString()
  @IsIn(['transaction_fee', 'subscription', 'add_ons'])
  type: string;

  @ApiProperty({ example: 'fixed_rate', enum: ['fixed_rate', 'percentage'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['fixed_rate', 'percentage'])
  transaction_fee_type?: string;

  @ApiProperty({ example: 5000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fixed_rate_value?: number;

  @ApiProperty({ example: 2.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage_value?: number;

  @ApiProperty({ example: 'monthly', enum: ['monthly', 'yearly'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['monthly', 'yearly'])
  subscription_type?: string;

  @ApiProperty({ example: 50000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  subscription_amount?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  yearly_discount?: number;

  @ApiProperty({ type: [AddOnTypeDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddOnTypeDto)
  add_ons_types?: AddOnTypeDto[];
}

export class NonDedicatedDto {
  @ApiProperty({ type: [NonDedicatedTierDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NonDedicatedTierDto)
  tiers: NonDedicatedTierDto[];
}

export class ChargingMetricDto {
  @ApiProperty({ example: 'dedicated', enum: ['dedicated', 'non_dedicated'] })
  @IsString()
  @IsIn(['dedicated', 'non_dedicated'])
  type: string;

  @ApiProperty({ type: DedicatedDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => DedicatedDto)
  dedicated?: DedicatedDto;

  @ApiProperty({ type: NonDedicatedDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => NonDedicatedDto)
  non_dedicated?: NonDedicatedDto;
}

export class AutoDeductDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  is_enabled: boolean;
}

export class TransactionDto {
  @ApiProperty({ example: 'weekly', enum: ['weekly', 'monthly'] })
  @IsString()
  @IsIn(['weekly', 'monthly'])
  schedule: string;
}

export class SubscriptionDto {
  @ApiProperty({ example: 'monthly', enum: ['monthly', 'yearly'] })
  @IsString()
  @IsIn(['monthly', 'yearly'])
  schedule: string;
}

export class PostPaidDto {
  @ApiProperty({ example: 'transaction', enum: ['transaction', 'subscription'] })
  @IsString()
  @IsIn(['transaction', 'subscription'])
  type: string;

  @ApiProperty({ type: TransactionDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => TransactionDto)
  transaction?: TransactionDto;

  @ApiProperty({ type: SubscriptionDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => SubscriptionDto)
  subscription?: SubscriptionDto;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  custom_fee?: number;
}

export class BillingMethodTypeDto {
  @ApiProperty({ example: 'auto_deduct', enum: ['auto_deduct', 'post_paid'] })
  @IsString()
  @IsIn(['auto_deduct', 'post_paid'])
  type: string;

  @ApiProperty({ type: AutoDeductDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AutoDeductDto)
  auto_deduct?: AutoDeductDto;

  @ApiProperty({ type: PostPaidDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PostPaidDto)
  post_paid?: PostPaidDto;
}

export class BillingMethodDto {
  @ApiProperty({ type: [BillingMethodTypeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillingMethodTypeDto)
  methods: BillingMethodTypeDto[];
}

export class TaxRulesDto {
  @ApiProperty({ example: 'include', enum: ['include', 'exclude'] })
  @IsString()
  @IsIn(['include', 'exclude'])
  type: string;

  @ApiProperty({ example: 11, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  rate?: number;
}

export class TermOfPaymentDto {
  @ApiProperty({ example: 30, enum: [14, 30] })
  @IsNumber()
  @IsIn([14, 30])
  days: number;
}

export class BillingRulesDto {
  @ApiProperty({ type: BillingMethodDto })
  @ValidateNested()
  @Type(() => BillingMethodDto)
  billing_method: BillingMethodDto;

  @ApiProperty({ type: TaxRulesDto })
  @ValidateNested()
  @Type(() => TaxRulesDto)
  tax_rules: TaxRulesDto;

  @ApiProperty({ type: TermOfPaymentDto })
  @ValidateNested()
  @Type(() => TermOfPaymentDto)
  term_of_payment: TermOfPaymentDto;
}

export class CreateAccountRevenueRuleTreeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  account_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  account_service_id: string;

  @ApiProperty({ type: ChargingMetricDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ChargingMetricDto)
  charging_metric?: ChargingMetricDto;

  @ApiProperty({ type: BillingRulesDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => BillingRulesDto)
  billing_rules?: BillingRulesDto;
}