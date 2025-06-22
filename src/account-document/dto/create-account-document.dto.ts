import { IsNotEmpty, IsString, IsUUID, IsOptional, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAccountDocumentDto {
  @ApiProperty({
    description: 'Account ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  @IsUUID()
  account_id: string;

  @ApiProperty({
    description: 'Document type code',
    example: 'KTP'
  })
  @IsNotEmpty()
  @IsString()
  document_type: string;

  @ApiPropertyOptional({
    description: 'Document expiration date',
    example: '2025-12-31'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expires_at?: Date;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}