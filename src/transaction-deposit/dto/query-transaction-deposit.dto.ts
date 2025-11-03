import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTransactionDepositDto {
  @ApiProperty({ description: 'Machine name filter', required: false })
  @IsOptional()
  @IsString()
  machine_name?: string;

  @ApiProperty({ description: 'Machine ID filter', required: false })
  @IsOptional()
  @IsString()
  machine_id?: string;

  @ApiProperty({ description: 'Start date filter (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({ description: 'End date filter (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({ description: 'Transaction status filter', required: false })
  @IsOptional()
  @IsString()
  transaction_status?: string;

  @ApiProperty({ description: 'Page number', example: 1, required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', example: 10, required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

