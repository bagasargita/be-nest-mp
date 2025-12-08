import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';

export enum MachineType {
  DEDICATED = 'dedicated',
  NON_DEDICATED = 'non-dedicated',
}

@Entity('m_machine')
@Index(['machine_type'])
@Index(['account_id'])
export class MasterMachine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ name: 'account_id', type: 'uuid', nullable: true, comment: 'Reference to m_account.id' })
  account_id: string;

  @Column({ name: 'machine_type', type: 'enum', enum: MachineType, nullable: false, comment: 'Type of machine: dedicated or non-dedicated' })
  machine_type: MachineType;

  @Column({ type: 'jsonb', nullable: true, comment: 'Data from external API stored as JSON' })
  data: any;

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

