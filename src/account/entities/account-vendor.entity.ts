import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('m_account_vendor')
export class AccountVendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Account, (account) => account.vendor_details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column()
  account_id: string;

  @Column({ type: 'jsonb', nullable: true })
  vendor_type: string[]; // Array: PJPUR, Gateway, Supplier, Maintenance

  @Column({ length: 50, nullable: true })
  vendor_classification: string;

  @Column({ length: 10, nullable: true })
  vendor_rating: string;

  @Column({ length: 50, nullable: true })
  tax_id: string;

  @Column({ type: 'date', nullable: true })
  contract_start_date: Date;

  @Column({ type: 'date', nullable: true })
  contract_end_date: Date;

  @Column({ length: 50, nullable: true })
  payment_terms: string;

  @Column({ length: 50, nullable: true })
  delivery_terms: string;

  @Column({ type: 'text', nullable: true })
  certification: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  vendor_uuid_be: string; // UUID from external API

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
