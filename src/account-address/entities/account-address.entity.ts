import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from '../../account/entities/account.entity';

@Entity('m_account_address')
export class AccountAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ length: 255 })
  address1: string;

  @Column({ length: 255, nullable: true })
  address2: string;

  @Column({ length: 100 })
  sub_district: string;

  @Column({ length: 100 })
  district: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  province: string;

  @Column({ length: 20 })
  postalcode: string;

  @Column({ length: 100 })
  country: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude: number;

  @Column({ length: 20, nullable: true })
  phone_no: string;

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