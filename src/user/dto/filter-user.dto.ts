import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class FilterUserDto {
  @ApiProperty({ description: 'Search by username, email, or full name', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Filter by active status', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}