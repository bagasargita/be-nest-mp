import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { Bank } from '../../bank/entities/bank.entity';
import { BankCategory } from '../../bank-category/entities/bank-category.entity';

@Entity('m_account_bank')
export class AccountBank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Bank)
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;

  @Column({ length: 50 })
  bank_account_no: string;

  @Column({ length: 100, nullable: true })
  bank_account_holder_name: string;

  @Column({ length: 100, nullable: true })
  bank_account_holder_firstname: string;
  
  @Column({ length: 100, nullable: true })
  bank_account_holder_lastname: string;

  @ManyToOne(() => BankCategory, { nullable: true })
  @JoinColumn({ name: 'bank_category_id' })
  bank_category: BankCategory;

  @Column({ default: true })
  is_active: boolean;

  @Column({ length: 50 })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ length: 50, nullable: true })
  updated_by: string;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ nullable: true })
  uuid_be: string;
}