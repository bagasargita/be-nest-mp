import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { SettlementMethod } from './settlement-method.entity';

@Entity()
export class SendGoodsMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SettlementMethod, method => method.sendGoodsMethods)
  settlementMethod: SettlementMethod;
}
