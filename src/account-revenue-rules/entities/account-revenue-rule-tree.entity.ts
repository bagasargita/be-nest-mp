import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { AccountService } from '../../account-service/entities/account-service.entity';

@Entity('m_account_revenue_rules_tree')
export class AccountRevenueRuleTree {
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

  @Column('jsonb') // or 'json' for MySQL
  charging_metric: object;

  @Column('jsonb') // or 'json' for MySQL  
  billing_rules: object;

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