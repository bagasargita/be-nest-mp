import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Tree, TreeParent, TreeChildren, JoinTable, ManyToMany
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

  // Referral fields
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  referral_commission_rate: number;

  @Column({ length: 50, nullable: true })
  referral_commission_type: string;

  @Column({ type: 'text', nullable: true })
  referral_commission_notes: string;

  // Location Partner fields
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  location_partner_commission_rate: number;

  @Column({ length: 50, nullable: true })
  location_partner_commission_type: string;

  @Column({ length: 255, nullable: true })
  location_partner_territory: string;

  @Column({ default: false })
  location_partner_exclusive: boolean;

  @Column({ type: 'text', nullable: true })
  location_partner_commission_notes: string;

  // Vendor fields (existing)
  @Column({ length: 50, nullable: true })
  vendor_type: string;

  @Column({ length: 50, nullable: true })
  vendor_classification: string;

  @Column({ length: 10, nullable: true })
  vendor_rating: string;

  @Column({ length: 50, nullable: true })
  tax_id: string;

  @Column({ type: 'date', nullable: true })
  contract_start_date: Date;

  @Column({ type: 'date', nullable: true })
  contract_end_date: Date;

  @Column({ length: 50, nullable: true })
  payment_terms: string;

  @Column({ length: 50, nullable: true })
  delivery_terms: string;

  @Column({ type: 'text', nullable: true })
  certification: string;

  @Column({ length: 50 })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ length: 50, nullable: true })
  updated_by: string;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}