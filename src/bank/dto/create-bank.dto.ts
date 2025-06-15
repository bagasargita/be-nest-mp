import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBankDto {
  @ApiProperty({
    description: 'Brand of the bank',
    example: 'BCA',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the bank',
    example: 'Bank Central Asia',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // @IsString()
  // created_by: string;
}