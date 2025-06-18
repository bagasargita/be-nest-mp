import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { SettlementMethod } from './settlement-method.entity';

@Entity()
export class SendMoneyMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SettlementMethod, method => method.sendMoneyMethods)
  settlementMethod: SettlementMethod;
}
