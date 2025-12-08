import { IsString, IsOptional, IsBoolean, IsEnum, IsObject, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MachineType } from '../entities/master-machine.entity';

export class CreateMasterMachineDto {
  @ApiProperty({
    description: 'Account ID from m_account table',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  account_id?: string;

  @ApiProperty({
    description: 'Type of machine: dedicated or non-dedicated',
    enum: MachineType,
    example: MachineType.DEDICATED,
  })
  @IsEnum(MachineType)
  machine_type: MachineType;

  @ApiProperty({
    description: 'Data from external API stored as JSON',
    example: { id: 'machine-123', name: 'ATM Machine', location: 'Jakarta' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  data?: any;

  @ApiProperty({
    description: 'Is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

