import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from './core/domain/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './infrastructure/guards/auth.guard';
import { ServiceModule } from './services/service.module';
import { Service } from './services/service.entity';
import { AccountModule } from './account/account.module';
import { AccountTypeModule } from './accounttype/accounttype.module';
import { BankModule } from './bank/bank.module';
import { BankCategoryModule } from './bank-category/bank-category.module';
import { TypeOfBusinessModule } from './type-of-business/type-of-business.module';
import { SettlementMethodModule } from './settlement-method/settlement-method.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'wms'),
        entities: [User, Service],
        synchronize: configService.get('NODE_ENV', 'development') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ServiceModule,
    AccountModule,
    AccountTypeModule,
    BankModule,
    BankCategoryModule,
    TypeOfBusinessModule,
    SettlementMethodModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
