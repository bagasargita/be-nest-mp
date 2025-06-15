import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountPICDto {
  @ApiProperty({
    description: 'ID of the account associated with the PIC',
    example: '12345',
  })
  @IsString()
  account_id: string;

  @ApiProperty({
    description: 'Name of the person in charge (PIC)',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'ID of the position of the PIC',
    required: false,
    example: 'position_123',
  })
  @IsOptional()
  @IsString()
  position_id?: string;

  @ApiProperty({
    description: 'Phone number of the PIC',
    example: '62123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone_no: string;

  @ApiProperty({
    description: 'Email address of the PIC',
    example: 'example@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // @IsString()
  // created_by: string;
}