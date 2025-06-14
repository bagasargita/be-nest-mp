import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankCategory } from './entities/bank-category.entity';
import { BankCategoryService } from './bank-category.service';
import { BankCategoryController } from './bank-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BankCategory])],
  providers: [BankCategoryService],
  controllers: [BankCategoryController],
  exports: [BankCategoryService],
})
export class BankCategoryModule {}