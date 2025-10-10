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
    description: 'Fix Line Phone number of the PIC',
    example: '62217599220',
    required: false,
  })
  @IsOptional()
  @IsString()
  fix_phone_no: string;

  @ApiProperty({
    description: 'Phone number of the PIC',
    example: '628123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone_no: string;

  @ApiProperty({
    description: 'Email address of the PIC',
    example: 'example@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({
    description: 'Indicates if the PIC is the owner',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_owner?: boolean;

  @ApiProperty({
    description: 'No KTP of the PIC',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  no_ktp?: string;

  @ApiProperty({
    description: 'No NPWP of the PIC',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  no_npwp?: string;

  @ApiProperty({
    description: 'Username of the PIC',
    example: 'john_doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'External UUID from backend system',
    example: 'ext-uuid-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  uuid_be?: string;
}