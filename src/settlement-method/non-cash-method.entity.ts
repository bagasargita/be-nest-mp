import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { SettlementMethod } from './settlement-method.entity';

@Entity()
export class NonCashMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SettlementMethod, method => method.nonCashMethods)
  settlementMethod: SettlementMethod;
}
