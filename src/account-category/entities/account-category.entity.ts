import { Entity, PrimaryGeneratedColumn, Column, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity('m_account_category')
@Tree('closure-table')
export class AccountCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @TreeParent()
  parent: AccountCategory | null;

  @TreeChildren()
  children: AccountCategory[];

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

// @ManyToOne(() => AccountCategory, (category) => category.children, { nullable: true })
//   parent: AccountCategory | null;