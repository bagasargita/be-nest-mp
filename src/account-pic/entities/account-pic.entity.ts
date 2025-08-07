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