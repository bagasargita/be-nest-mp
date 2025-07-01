import { IsString, IsEmail, IsBoolean, IsOptional, IsArray, IsUUID, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User username' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'Role IDs assigned to the user', required: false, type: [String] })
  @IsArray()
  @IsUUID(4, { each: true })
  @IsOptional()
  roleIds?: string[];

  @ApiProperty({ description: 'Is user active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

//   @ApiProperty({ description: 'User phone number', required: false })
//   @IsString()
//   @IsOptional()
//   phoneNumber?: string;

//   @ApiProperty({ description: 'User position/title', required: false })
//   @IsString()
//   @IsOptional()
//   position?: string;
}