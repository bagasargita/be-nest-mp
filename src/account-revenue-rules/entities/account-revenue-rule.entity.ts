import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { AccountService } from '../../account-service/entities/account-service.entity';

@Entity('m_account_revenue_rules')
export class AccountRevenueRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  account_id: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column()
  account_service_id: string;

  @ManyToOne(() => AccountService, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_service_id' })
  accountService: AccountService;

  @Column()
  rule_category: string;

  @Column()
  rule_path: string;

  @Column('text')
  rule_value: string;

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
}