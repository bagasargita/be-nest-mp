import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Tree, TreeParent, TreeChildren, JoinTable, ManyToMany, OneToMany, OneToOne
} from 'typeorm';
import { Industry } from '../../industry/entities/industry.entity';
import { TypeOfBusiness } from '../../type-of-business/entities/type-of-business.entity';
import { AccountType } from '../../accounttype/entities/accounttype.entity';
import { AccountCategory } from '../../account-category/entities/account-category.entity';
import { AccountCommissionRate } from './account-commission-rate.entity';
import { AccountVendor } from './account-vendor.entity';

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

  @Column({ length: 30, nullable: true })
  phone_no: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  email: string;

  @ManyToOne(() => Industry, { nullable: true })
  @JoinColumn({ name: 'industry_id' })
  industry: Industry;

  @ManyToOne(() => TypeOfBusiness, { nullable: true })
  @JoinColumn({ name: 'type_of_business_id' })
  type_of_business: TypeOfBusiness;

  @Column({ type: 'text', nullable: true })
  type_of_business_detail: string;

  @ManyToOne(() => AccountType, { nullable: true })
  @JoinColumn({ name: 'account_type_id' })
  account_type: AccountType;

  @ManyToMany(() => AccountCategory, { nullable: true })
  @JoinTable({ 
    name: 'account_account_category',
    joinColumn: { name: 'account_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'account_category_id', referencedColumnName: 'id' }
  })
  account_categories: AccountCategory[];

  @TreeParent()
  parent: Account | null;

  @TreeChildren()
  children: Account[];

  @Column({ nullable: true })
  parentId: string | null;

  @Column({ default: true })
  is_active: boolean;

  // Relations to separated entities
  @OneToMany(() => AccountCommissionRate, (rate) => rate.account, { cascade: true })
  commission_rates: AccountCommissionRate[];

  @OneToOne(() => AccountVendor, (vendor) => vendor.account, { cascade: true })
  vendor_details: AccountVendor;

  @Column({ length: 50 })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ length: 50, nullable: true })
  updated_by: string;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  uuid_be?: string;

  @Column({ nullable: true })
  no_ktp: string;

  @Column({ nullable: true })
  no_npwp: string;
}