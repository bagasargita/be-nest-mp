import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('m_account_tax_rule')
export class AccountTaxRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'account_id' })
  account_id: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  rate: number;

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
