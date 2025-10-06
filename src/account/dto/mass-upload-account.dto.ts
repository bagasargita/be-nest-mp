import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MassUploadAccountDto {
  @ApiProperty({ 
    description: 'CSV file containing account data',
    type: 'string',
    format: 'binary'
  })
  file: Express.Multer.File;
}

export class AccountCsvRowDto {
  @IsString()
  @ApiProperty({ description: 'Account name (required)', example: 'PT ABC Company' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Brand name', example: 'ABC Brand', required: false })
  brand_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Parent account name', example: 'PT Parent Company', required: false })
  parent_account_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Industry name', example: 'Technology', required: false })
  industry_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Type of business name', example: 'Corporation', required: false })
  type_of_business_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Type of business detail (required for Other types)', example: 'Custom business type', required: false })
  type_of_business_detail?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Account type name', example: 'Client', required: false })
  account_type_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Account category names (comma-separated)', example: 'Premium,Corporate', required: false })
  account_category_names?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Active status', example: true, required: false })
  is_active?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'No KTP', example: '000092000413', required: false })
  no_ktp?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'No NPWP', example: '00009200413', required: false })
  no_npwp?: string;
}

export class MassUploadResultDto {
  @ApiProperty({ description: 'Total number of rows processed' })
  totalRows: number;

  @ApiProperty({ description: 'Number of successfully created accounts' })
  successCount: number;

  @ApiProperty({ description: 'Number of failed account creations' })
  errorCount: number;

  @ApiProperty({ description: 'List of error messages', type: [String] })
  errors: string[];

  @ApiProperty({ description: 'List of successfully created accounts', type: [Object] })
  successfulAccounts: SuccessfulAccountDto[];

  @ApiProperty({ description: 'List of warnings (non-critical issues)', type: [String] })
  warnings: string[];
}

export class SuccessfulAccountDto {
  @ApiProperty({ description: 'Row number in CSV' })
  row: number;

  @ApiProperty({ description: 'Created account information' })
  account: {
    id: string;
    name: string;
    brand_name?: string;
    account_no?: string;
  };
}