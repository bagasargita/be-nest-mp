import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { AccountBillingMethod } from './account-billing-method.entity';

@Entity('m_account_add_ons')
@Index('IDX_account_add_ons_account_id', ['account_id'])
@Index('IDX_account_add_ons_active', ['account_id', 'is_active'])
@Index('IDX_account_add_ons_billing_method_id', ['billing_method_id'])
export class AccountAddOns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  account_id: string;

  @Column({ type: 'uuid', nullable: true, name: 'billing_method_id' })
  billing_method_id: string;

  @ManyToOne(() => AccountBillingMethod, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'billing_method_id' })
  billing_method: AccountBillingMethod;

  @Column({
    type: 'enum',
    enum: ['system_integration', 'infrastructure'],
    comment: 'Type of add-on'
  })
  add_ons_type: 'system_integration' | 'infrastructure';

  @Column({
    type: 'enum',
    enum: ['otc', 'monthly'],
    comment: 'Billing type for the add-on'
  })
  billing_type: 'otc' | 'monthly';

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    comment: 'Amount for the add-on'
  })
  amount: number;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Additional description for the add-on'
  })
  description: string;

  // System Integration specific fields
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'API type for system integration'
  })
  api_type: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Complexity level for system integration'
  })
  complexity_level: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    comment: 'Base fee for system integration'
  })
  base_fee: number;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Whether custom development is required'
  })
  requires_custom_development: boolean;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    comment: 'Custom development fee'
  })
  custom_development_fee: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'auto_deduct',
    comment: 'Billing method type'
  })
  billing_method_type: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    comment: 'Custom fee for post paid billing'
  })
  custom_fee: number;

  // Infrastructure specific fields
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Infrastructure type'
  })
  infrastructure_type: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Resource size for infrastructure'
  })
  resource_size: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    comment: 'Monthly fee for infrastructure'
  })
  monthly_fee: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    comment: 'Setup fee for infrastructure'
  })
  setup_fee: number;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Whether infrastructure is scalable'
  })
  is_scalable: boolean;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Start date when this add-on becomes effective'
  })
  start_date: Date;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'End date when this add-on expires'
  })
  end_date: Date;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Whether this add-on is active'
  })
  is_active: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'User who created this record'
  })
  created_by: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated this record'
  })
  updated_by: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when record was created'
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Timestamp when record was last updated'
  })
  updated_at: Date;
}
