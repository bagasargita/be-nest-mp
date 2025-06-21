import { IsString, IsOptional, IsUUID, IsEnum, IsNumber, IsBoolean } from 'class-validator';

enum Category {
  CHARGING_METRIC = 'CHARGING_METRIC',
  BILLING_RULES = 'BILLING_RULES'
}

enum ChargingType {
  DEDICATED = 'DEDICATED',
  NON_DEDICATED = 'NON_DEDICATED'
}

enum DedicatedType {
  PACKAGE = 'PACKAGE',
  NON_PACKAGE = 'NON_PACKAGE',
  ADD_ONS = 'ADD_ONS'
}

enum NonPackageType {
  MACHINE_ONLY = 'MACHINE_ONLY',
  SERVICE_ONLY = 'SERVICE_ONLY'
}

enum AddOnsType {
  SYSTEM_INTEGRATION = 'SYSTEM_INTEGRATION',
  INFRASTRUCTURE = 'INFRASTRUCTURE'
}

enum SystemIntegrationType {
  OTC = 'OTC',
  MONTHLY = 'MONTHLY'
}

enum NonDedicatedType {
  TRANSACTION_FEE = 'TRANSACTION_FEE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  HYBRID = 'HYBRID',
  ADD_ONS = 'ADD_ONS'
}

enum TransactionFeeType {
  FIXED_RATE = 'FIXED_RATE',
  PERCENTAGE = 'PERCENTAGE'
}

enum SubscriptionPeriod {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

enum BillingRuleType {
  BILLING_METHOD = 'BILLING_METHOD',
  TAX_RULES = 'TAX_RULES',
  TERM_OF_PAYMENT = 'TERM_OF_PAYMENT'
}

enum BillingMethodType {
  AUTO_DEDUCT = 'AUTO_DEDUCT',
  POST_PAID = 'POST_PAID',
  HYBRID = 'HYBRID'
}

enum PaymentType {
  TRANSACTION = 'TRANSACTION',
  SUBSCRIPTION = 'SUBSCRIPTION'
}

enum PaymentPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

enum TaxRuleType {
  INCLUDE = 'INCLUDE',
  EXCLUDE = 'EXCLUDE'
}

enum TopPeriod {
  DAYS_14 = '14_DAYS',
  DAYS_30 = '30_DAYS'
}

export class CreateRevenueRuleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsEnum(Category)
  @IsOptional()
  category?: Category;

  @IsEnum(ChargingType)
  @IsOptional()
  chargingType?: ChargingType;

  @IsEnum(DedicatedType)
  @IsOptional()
  dedicatedType?: DedicatedType;

  @IsEnum(NonPackageType)
  @IsOptional()
  nonPackageType?: NonPackageType;

  @IsEnum(AddOnsType)
  @IsOptional()
  addOnsType?: AddOnsType;

  @IsEnum(SystemIntegrationType)
  @IsOptional()
  systemIntegrationType?: SystemIntegrationType;

  @IsEnum(NonDedicatedType)
  @IsOptional()
  nonDedicatedType?: NonDedicatedType;

  @IsEnum(TransactionFeeType)
  @IsOptional()
  transactionFeeType?: TransactionFeeType;

  @IsEnum(SubscriptionPeriod)
  @IsOptional()
  subscriptionPeriod?: SubscriptionPeriod;

  @IsBoolean()
  @IsOptional()
  hasDiscount?: boolean;

  @IsEnum(BillingRuleType)
  @IsOptional()
  billingRuleType?: BillingRuleType;

  @IsEnum(BillingMethodType)
  @IsOptional()
  billingMethodType?: BillingMethodType;

  @IsEnum(PaymentType)
  @IsOptional()
  paymentType?: PaymentType;

  @IsEnum(PaymentPeriod)
  @IsOptional()
  paymentPeriod?: PaymentPeriod;

  @IsEnum(TaxRuleType)
  @IsOptional()
  taxRuleType?: TaxRuleType;

  @IsEnum(TopPeriod)
  @IsOptional()
  topPeriod?: TopPeriod;

  @IsNumber()
  @IsOptional()
  value?: number;

  @IsNumber()
  @IsOptional()
  parentId?: number;
} 