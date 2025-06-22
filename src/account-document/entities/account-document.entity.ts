import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';

@Entity('m_account_document')
export class AccountDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  document_type: string;

  @Column({ nullable: true })
  expires_at: Date;

  @Column({ nullable: false })
  filename: string;

  @Column({ nullable: false })
  file_path: string;

  @Column({ nullable: true })
  file_size: number;

  @Column({ nullable: true })
  mime_type: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  created_by: string;

  @Column({ nullable: true })
  updated_by: string;
}