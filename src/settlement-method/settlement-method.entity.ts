
import { Entity, Column, PrimaryGeneratedColumn, Tree, TreeParent, TreeChildren, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { NonCashMethod } from './non-cash-method.entity';
import { CashDepositMethod } from './cash-deposit-method.entity';
import { SendMoneyMethod } from './send-money-method.entity';
import { SendGoodsMethod } from './send-good-method.entity';

@Entity()
export class SettlementMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => CashDepositMethod, method => method.settlementMethod)
  cashDepositMethods: CashDepositMethod[];

  @OneToMany(() => NonCashMethod, method => method.settlementMethod)
  nonCashMethods: NonCashMethod[];
  
  @OneToMany(() => SendMoneyMethod, method => method.settlementMethod)
  sendMoneyMethods: SendMoneyMethod[];

  @OneToMany(() => SendGoodsMethod, method => method.settlementMethod)
  sendGoodsMethods: SendGoodsMethod[];
}
