import { Entity, Column, PrimaryGeneratedColumn, Tree, TreeParent, TreeChildren, ManyToOne, JoinColumn } from 'typeorm';

@Entity('revenue-rules')
@Tree('materialized-path')
export class RevenueRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column({ type: 'enum', enum: ['CHARGING_METRIC', 'BILLING_RULES'], nullable: true })
  category: string;

  @Column({ type: 'enum', enum: ['DEDICATED', 'NON_DEDICATED'], nullable: true })
  chargingType: string;

  @Column({ type: 'enum', enum: ['PACKAGE', 'NON_PACKAGE', 'ADD_ONS'], nullable: true })
  dedicatedType: string;

  @Column({ type: 'enum', enum: ['MACHINE_ONLY', 'SERVICE_ONLY'], nullable: true })
  nonPackageType: string;

  @Column({ type: 'enum', enum: ['SYSTEM_INTEGRATION', 'INFRASTRUCTURE'], nullable: true })
  addOnsType: string;

  @Column({ type: 'enum', enum: ['OTC', 'MONTHLY'], nullable: true })
  systemIntegrationType: string;

  @Column({ type: 'enum', enum: ['TRANSACTION_FEE', 'SUBSCRIPTION', 'HYBRID', 'ADD_ONS'], nullable: true })
  nonDedicatedType: string;

  @Column({ type: 'enum', enum: ['FIXED_RATE', 'PERCENTAGE'], nullable: true })
  transactionFeeType: string;

  @Column({ type: 'enum', enum: ['MONTHLY', 'YEARLY'], nullable: true })
  subscriptionPeriod: string;

  @Column({ type: 'boolean', nullable: true })
  hasDiscount: boolean;

  @Column({ type: 'enum', enum: ['BILLING_METHOD', 'TAX_RULES', 'TERM_OF_PAYMENT'], nullable: true })
  billingRuleType: string;

  @Column({ type: 'enum', enum: ['AUTO_DEDUCT', 'POST_PAID', 'HYBRID'], nullable: true })
  billingMethodType: string;

  @Column({ type: 'enum', enum: ['TRANSACTION', 'SUBSCRIPTION'], nullable: true })
  paymentType: string;

  @Column({ type: 'enum', enum: ['WEEKLY', 'MONTHLY', 'YEARLY'], nullable: true })
  paymentPeriod: string;

  @Column({ type: 'enum', enum: ['INCLUDE', 'EXCLUDE'], nullable: true })
  taxRuleType: string;

  @Column({ type: 'enum', enum: ['14_DAYS', '30_DAYS'], nullable: true })
  topPeriod: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value: number;

  @TreeParent()
  parent: RevenueRule | null;

  @TreeChildren()
  children: RevenueRule[];
} 