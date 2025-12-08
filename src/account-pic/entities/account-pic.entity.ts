import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { Position } from '../../position/entities/position.entity';

@Entity('m_account_pic')
export class AccountPIC {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Position, { nullable: true })
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @Column({ length: 30, nullable: true })
  fix_phone_no: string;
  
  @Column({ length: 30 })
  phone_no: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  no_ktp: string;

  @Column({ nullable: true })
  no_npwp: string;

  @Column({ default: false, name: 'is_owner' })
  is_owner: boolean;

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

  @Column({ type: 'varchar', length: 100, nullable: true })
  username?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  password?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  uuid_be?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  role_access: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  role_access_mobile: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  web_portal: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  mobile: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  role: string;
}