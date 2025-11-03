import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('transaction_deposit')
export class TransactionDeposit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  code: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_deposit: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  charging_fee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_transfer: number;

  @Column({ type: 'varchar', length: 50 })
  @Index()
  transaction_status: string; // SUCCESS, FAILED, PENDING

  @Column({ type: 'text', nullable: true })
  machine_info: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  machine_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index()
  cdm_trx_no: string;

  @Column({ type: 'date', nullable: true })
  @Index()
  cdm_trx_date: Date;

  @Column({ type: 'time', nullable: true })
  cdm_trx_time: string;

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  cdm_trx_date_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  jam_posting: Date;

  // JSON columns for nested objects
  @Column({ type: 'jsonb', nullable: true })
  denominations: any[];

  @Column({ type: 'jsonb', nullable: true })
  user: any;

  @Column({ type: 'jsonb', nullable: true })
  customer: any;

  @Column({ type: 'jsonb', nullable: true })
  beneficiary_account: any;

  @Column({ type: 'jsonb', nullable: true })
  machine: any;

  @Column({ type: 'jsonb', nullable: true })
  service_product: any;

  @Column({ type: 'jsonb', nullable: true })
  pjpur_status: any;

  @Column({ type: 'jsonb', nullable: true })
  gateway_status: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

