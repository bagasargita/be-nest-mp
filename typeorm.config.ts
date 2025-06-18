import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './src/core/domain/entities/user.entity';
import { Service } from './src/services/service.entity';
import { SettlementMethod } from './src/settlement-method/settlement-method.entity';
import { NonCashMethod } from './src/settlement-method/non-cash-method.entity';
import { CashDepositMethod } from './src/settlement-method/cash-deposit-method.entity';
import { SendMoneyMethod } from './src/settlement-method/send-money-method.entity';
import { SendGoodsMethod } from './src/settlement-method/send-good-method.entity';
import { BatchingDetail } from './src/settlement-method/batching-detail.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_DATABASE', 'wms'),
  entities: [User, Service, SettlementMethod, NonCashMethod, CashDepositMethod, SendMoneyMethod, SendGoodsMethod, BatchingDetail],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  synchronize: false,
}); 