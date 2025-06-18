import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { SettlementMethod } from './settlement-method.entity';
import { BatchingDetail } from './batching-detail.entity';

@Entity()
export class CashDepositMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'ByTransaction' | 'ByBatching';

  @ManyToOne(() => SettlementMethod, method => method.cashDepositMethods)
  settlementMethod: SettlementMethod;

  @OneToOne(() => BatchingDetail, { nullable: true, cascade: true })
  @JoinColumn()
  batchingDetail?: BatchingDetail;
}
