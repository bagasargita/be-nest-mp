import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsArray, IsUUID, IsNumber, IsDecimal } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Unique identifier for the account',
    example: 'acc_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  account_no?: string;

  @ApiProperty({
    description: 'Name of the account',
    example: 'Tech Innovations Ltd.',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Brand name of the account',
    example: 'ABC Tech',
    required: false,
  })
  @IsOptional()
  @IsString()
  brand_name?: string;

  @ApiProperty({
    description: 'Industry ID associated with the account',
    example: 'ind_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  industry_id?: string;

  @ApiProperty({
    description: 'Type of business ID associated with the account',
    example: 'type_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  type_of_business_id?: string;

  @ApiProperty({
    description: 'Detail of type of business - populated automatically from type_of_business or free text for "Other"',
    example: 'A type of business that is incorporated and has a separate legal identity.',
    required: false,
  })
  @IsOptional()
  @IsString()
  type_of_business_detail?: string;

  @ApiProperty({
    description: 'Account type ID associated with the account', 
    example: 'type_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  account_type_id?: string;

  @ApiProperty({
    description: 'Account category IDs associated with the account',
    example: ['cat_1234567890', 'cat_9876543210'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  account_category_ids?: string[];

  @ApiProperty({
    description: 'Parent account ID if this account is a sub-account',
    example: 'parent_acc_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  parent_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({
    description: 'External UUID from backend system',
    example: 'ext-uuid-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  uuid_be?: string;

  @ApiProperty({
    description: 'Phone number of the account',
    example: '+621234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone_no?: string;

  @ApiProperty({
    description: 'Email address of the account',
    example: 'info@techinnovations.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'KTP number of the account owner (if individual)',
    example: '1234567890123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  no_ktp?: string;

  @ApiProperty({
    description: 'NPWP number of the account owner (if individual)',
    example: '12.345.678.9-012.000',
    required: false,
  })
  @IsOptional()
  @IsString()
  no_npwp?: string;

  // Referral fields
  @ApiProperty({
    description: 'Array of account IDs that referred this account',
    example: ['ref_acc_1234567890', 'ref_acc_9876543210'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  referral_account_ids?: string[];

  @ApiProperty({
    description: 'Commission rate for referrals (percentage)',
    example: 5.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  referral_commission_rate?: number;

  @ApiProperty({
    description: 'Type of commission calculation for referrals',
    example: 'percentage',
    enum: ['percentage', 'fixed_amount', 'tiered'],
    required: false,
  })
  @IsOptional()
  @IsString()
  referral_commission_type?: string;

  @ApiProperty({
    description: 'Notes about referral commission terms',
    example: 'Commission calculated monthly based on net revenue',
    required: false,
  })
  @IsOptional()
  @IsString()
  referral_commission_notes?: string;

  // Location Partner fields
  @ApiProperty({
    description: 'Commission rate for location partner (percentage)',
    example: 10.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  location_partner_commission_rate?: number;

  @ApiProperty({
    description: 'Type of commission calculation for location partner',
    example: 'percentage',
    enum: ['percentage', 'fixed_amount', 'revenue_share'],
    required: false,
  })
  @IsOptional()
  @IsString()
  location_partner_commission_type?: string;

  @ApiProperty({
    description: 'Territory or area coverage for location partner',
    example: 'Jakarta, Bandung, Surabaya',
    required: false,
  })
  @IsOptional()
  @IsString()
  location_partner_territory?: string;

  @ApiProperty({
    description: 'Whether the location partnership is exclusive',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  location_partner_exclusive?: boolean;

  @ApiProperty({
    description: 'Notes about location partner commission terms',
    example: 'Exclusive partnership for Greater Jakarta area',
    required: false,
  })
  @IsOptional()
  @IsString()
  location_partner_commission_notes?: string;

  // Vendor fields
  @ApiProperty({
    description: 'Type of vendor',
    example: 'supplier',
    enum: ['supplier', 'contractor', 'consultant', 'service_provider', 'distributor', 'other'],
    required: false,
  })
  @IsOptional()
  @IsString()
  vendor_type?: string;

  @ApiProperty({
    description: 'Vendor classification level',
    example: 'strategic',
    enum: ['strategic', 'preferred', 'standard', 'conditional'],
    required: false,
  })
  @IsOptional()
  @IsString()
  vendor_classification?: string;

  @ApiProperty({
    description: 'Vendor performance rating',
    example: 'A',
    enum: ['A', 'B', 'C', 'D'],
    required: false,
  })
  @IsOptional()
  @IsString()
  vendor_rating?: string;

  @ApiProperty({
    description: 'Tax identification number',
    example: '12.345.678.9-012.000',
    required: false,
  })
  @IsOptional()
  @IsString()
  tax_id?: string;

  @ApiProperty({
    description: 'Contract start date',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  contract_start_date?: string;

  @ApiProperty({
    description: 'Contract end date',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @IsString()
  contract_end_date?: string;

  @ApiProperty({
    description: 'Payment terms with vendor',
    example: 'net_30',
    enum: ['net_30', 'net_15', 'net_7', 'cod', 'advance', 'custom'],
    required: false,
  })
  @IsOptional()
  @IsString()
  payment_terms?: string;

  @ApiProperty({
    description: 'Delivery terms with vendor',
    example: 'fob',
    enum: ['fob', 'cif', 'ddu', 'ddp', 'ex_works', 'custom'],
    required: false,
  })
  @IsOptional()
  @IsString()
  delivery_terms?: string;

  @ApiProperty({
    description: 'Vendor certifications',
    example: 'ISO 9001:2015, ISO 27001:2013',
    required: false,
  })
  @IsOptional()
  @IsString()
  certification?: string;
}