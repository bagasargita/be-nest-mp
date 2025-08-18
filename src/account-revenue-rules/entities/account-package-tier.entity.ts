import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Account } from '../../account/entities/account.entity';

@Entity('m_account_package_tier')
export class AccountPackageTier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  account_id: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

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
