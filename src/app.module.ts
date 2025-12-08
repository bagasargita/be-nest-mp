import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from './core/domain/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './infrastructure/guards/auth.guard';
import { config } from 'dotenv';
import { ServiceModule } from './services/service.module';
import { Service } from './services/service.entity';
import { AccountModule } from './account/account.module';
import { AccountTypeModule } from './accounttype/accounttype.module';
import { BankModule } from './bank/bank.module';
import { BankCategoryModule } from './bank-category/bank-category.module';
import { TypeOfBusinessModule } from './type-of-business/type-of-business.module';
import { AccountCategoryModule } from './account-category/account-category.module';
import { PositionModule } from './position/position.module';
import { IndustryModule } from './industry/industry.module';
import { AccountAddressModule } from './account-address/account-address.module';
import { AccountBankModule } from './account-bank/account-bank.module';
import { AccountPICModule } from './account-pic/account-pic.module';
import { SettlementMethodModule } from './settlement-method/settlement-method.module';
import { AccountServiceModule } from './account-service/account-service.module';
import { AccountDocumentModule } from './account-document/account-document.module';
import { DocumentTypeModule } from './document-type/document-type.module';
import { RevenueRuleModule } from './revenue-rules/revenue-rules.module';
import { AccountRevenueRulesModule } from './account-revenue-rules/account-revenue-rules.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { CdmProviderModule } from './cdm-provider/cdm-provider.module';
import { CashLogisticsProviderModule } from './cash-logistics-provider/cash-logistics-provider.module';
import { PostalcodeModule } from './postalcode/postalcode.module';
import { BackendExtModule } from './backend-ext/backend-ext.module';
import { PublishedPackageTierModule } from './published-package-tier/published-package-tier.module';
import { MasterPaymentGatewayModule } from './master-payment-gateway/master-payment-gateway.module';
import { TransactionDepositModule } from './transaction-deposit/transaction-deposit.module';
import { MasterMachineModule } from './master-machine/master-machine.module';

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
        username: configService.get('DB_USERNAME', 'custmp'),
        password: configService.get('DB_PASSWORD', 'CustMP123'),
        database: configService.get('DB_DATABASE', 'custmp_db'),
        // entities: [User, Service],
        entities: [],
        autoLoadEntities: true,
        // synchronize: configService.get('NODE_ENV', 'development') === 'development',
        synchronize: false,
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
    AccountCategoryModule,
    PositionModule,
    IndustryModule,
    AccountAddressModule,
    AccountBankModule,
    AccountPICModule,
    SettlementMethodModule,
    AccountServiceModule,
    AccountDocumentModule,
    DocumentTypeModule,
    RevenueRuleModule,
    AccountRevenueRulesModule,
    RoleModule,
    PermissionModule,
    UserModule,
    MenuModule,
    CdmProviderModule,
    CashLogisticsProviderModule,
    PostalcodeModule,
    BackendExtModule,
    PublishedPackageTierModule,
    MasterPaymentGatewayModule,
    TransactionDepositModule,
    MasterMachineModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
