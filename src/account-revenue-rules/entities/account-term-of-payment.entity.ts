import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('m_account_term_of_payment')
export class AccountTermOfPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'account_id' })
  account_id: string;

  @Column({ type: 'varchar', length: 100, name: 'payment_term' })
  payment_term: string;

  @Column({ type: 'integer', name: 'due_days' })
  due_days: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'late_fee_rate' })
  late_fee_rate: number;

  @Column({ type: 'integer', nullable: true, name: 'grace_period' })
  grace_period: number;

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
