import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountCategory } from './entities/account-category.entity';
import { AccountCategoryService } from './account-category.service';
import { AccountCategoryController } from './account-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountCategory])],
  providers: [AccountCategoryService],
  controllers: [AccountCategoryController],
  exports: [AccountCategoryService],
})
export class AccountCategoryModule {}