import { IsString, IsEmail, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountServiceDto {
    @ApiProperty({
        description: 'Unique identifier for the account',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    @IsNotEmpty()
    account_id: string;
    
    @ApiProperty({
        description: 'Service identifier',
        example: 'service_123',
    })
    @IsString()
    @IsNotEmpty()
    service_id: string;
    
    @ApiProperty({
        description: 'Indicates if the service is active',
        example: true,
        required: false,
    })

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
