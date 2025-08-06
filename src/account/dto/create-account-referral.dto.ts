import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateAccountReferralDto {
  @ApiProperty({
    description: 'Account ID that is being referred to',
    example: 'acc_1234567890',
  })
  @IsString()
  @IsUUID()
  account_id: string;

  @ApiProperty({
    description: 'Account ID that made the referral',
    example: 'ref_acc_9876543210',
  })
  @IsString()
  @IsUUID()
  referral_account_id: string;

  @ApiProperty({
    description: 'Whether the referral relationship is active',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
