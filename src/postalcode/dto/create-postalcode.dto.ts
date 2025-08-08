import { IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostalcodeDto {
    @ApiProperty({
        description: 'Unique identifier for the postal code',
        example: '12345',
        required: true,
    })
    @IsString()
    postal_code: string;

    @ApiProperty({
        description: 'Sub-district name',
        example: 'Downtown',
        required: true,
    })
    @IsString()
    sub_district: string;

    @ApiProperty({
        description: 'District name',
        example: 'Downtown',
        required: true,
    })
    @IsString()
    district: string;

    @ApiProperty({
        description: 'City name',
        example: 'Springfield',
        required: true,
    })
    @IsString()
    city: string;

    @ApiProperty({
        description: 'Province name',
        example: 'Illinois',
        required: true,
    })
    @IsString()
    province: string;

    @ApiProperty({
        description: 'Country name',
        example: 'United States',
        required: true,
    })
    @IsString()
    country: string;

    @ApiProperty({
        description: 'Is this postal code active',
        example: true,
        required: false,
    })
    @IsBoolean()
    is_active: boolean;
}
