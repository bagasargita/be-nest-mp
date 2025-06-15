import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Tree, TreeParent, TreeChildren
} from 'typeorm';
import { Industry } from '../../industry/entities/industry.entity';
import { TypeOfBusiness } from '../../type-of-business/entities/type-of-business.entity';
import { AccountType } from '../../accounttype/entities/accounttype.entity';
import { AccountCategory } from '../../account-category/entities/account-category.entity';

@Entity('m_account')
@Tree('closure-table')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30, nullable: true })
  account_no: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 200, nullable: true })
  brand_name: string;

  @ManyToOne(() => Industry, { nullable: true })
  @JoinColumn({ name: 'industry_id' })
  industry: Industry;

  @ManyToOne(() => TypeOfBusiness, { nullable: true })
  @JoinColumn({ name: 'type_of_business_id' })
  type_of_business: TypeOfBusiness;

  @ManyToOne(() => AccountType, { nullable: true })
  @JoinColumn({ name: 'account_type_id' })
  account_type: AccountType;

  @ManyToOne(() => AccountCategory, { nullable: true })
  @JoinColumn({ name: 'account_category_id' })
  account_category: AccountCategory;

  @TreeParent()
  parent: Account | null;

  @TreeChildren()
  children: Account[];

  @Column({ nullable: true })
  parentId: string | null;

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