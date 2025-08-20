import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AccountAddOns } from './account-add-ons.entity';
import { AccountPackageTier } from './account-package-tier.entity';

@Entity('m_account_billing_method')
export class AccountBillingMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'account_id' })
  account_id: string;

  @OneToMany(() => AccountAddOns, addOn => addOn.billing_method)
  add_ons: AccountAddOns[];

  @OneToMany(() => AccountPackageTier, packageTier => packageTier.billing_method)
  package_tiers: AccountPackageTier[];

  @Column({ type: 'varchar', length: 100 })
  method: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @Column({ type: 'varchar', length: 50, name: 'created_by' })
  created_by: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'updated_by' })
  updated_by: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
