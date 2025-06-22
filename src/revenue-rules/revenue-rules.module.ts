import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevenueRuleService } from './revenue-rules.service';
import { RevenueRuleController } from './revenue-rules.controller';
import { RevenueRule } from './revenue-rules.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RevenueRule])],
  controllers: [RevenueRuleController],
  providers: [RevenueRuleService],
  exports: [RevenueRuleService],
})
export class RevenueRuleModule {} 