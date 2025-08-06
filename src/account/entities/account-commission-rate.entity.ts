import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('m_account_commission_rate')
export class AccountCommissionRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.commission_rates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column()
  account_id: string;

  @Column({ length: 50 })
  commission_type: string; // 'referral', 'location_partner'

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  commission_rate: number;

  @Column({ length: 50, nullable: true })
  rate_type: string; // 'percentage', 'fixed_amount', 'revenue_share'

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Location Partner specific fields
  @Column({ length: 255, nullable: true })
  territory: string;

  @Column({ default: false })
  exclusive: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column({ length: 50 })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ length: 50, nullable: true })
  updated_by: string;

  @UpdateDateColumn()
  updated_at: Date;
}
