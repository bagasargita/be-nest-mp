import { IsString, IsOptional, IsBoolean, IsEnum, IsNumber, IsEmail, IsUUID, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCdmProviderDto {
    @ApiProperty({ description: 'Provider name', example: 'PT CDM Provider Indonesia' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Provider description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Is active flag', example: true })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional({ description: 'Parent provider ID' })
    @IsOptional()
    @IsUUID()
    parent_id?: string;

    @ApiPropertyOptional({ description: 'Created by user ID', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID()
    created_by?: string;

    @ApiPropertyOptional({ description: 'Created at timestamp', example: '2023-10-01T12:00:00Z' })
    @IsOptional()
    @IsDate()
    created_at?: Date;

    @ApiPropertyOptional({ description: 'Updated by user ID', example: '123e4567-e89b-12d3-a456-426614174001' })
    @IsOptional()
    @IsUUID()   
    updated_by?: string;

    @ApiPropertyOptional({ description: 'Updated at timestamp', example: '2023-10-01T12:00:00Z' })
    @IsOptional()
    @IsDate()
    updated_at?: Date;    
}
