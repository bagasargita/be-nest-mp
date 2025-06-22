import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentTypeDto {
  @ApiProperty({
    description: 'Document type code',
    example: 'KTP'
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Document type name',
    example: 'Kartu Tanda Penduduk'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Document type description',
    example: 'Indonesian national identity card'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Active status',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}