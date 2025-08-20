import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { AccountBillingMethod } from './account-billing-method.entity';

@Entity('m_account_package_tier')
@Index('IDX_account_package_tier_billing_method_id', ['billing_method_id'])
export class AccountPackageTier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  account_id: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ type: 'uuid', nullable: true, name: 'billing_method_id' })
  billing_method_id: string;

  @ManyToOne(() => AccountBillingMethod, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'billing_method_id' })
  billing_method: AccountBillingMethod;

  @Column('decimal', { precision: 15, scale: 2 })
  min_value: number;

  @Column('decimal', { precision: 15, scale: 2 })
  max_value: number;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

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
