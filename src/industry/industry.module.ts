import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Industry } from './entities/industry.entity';
import { IndustryService } from './industry.service';
import { IndustryController } from './industry.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Industry])],
  providers: [IndustryService],
  controllers: [IndustryController],
  exports: [IndustryService],
})
export class IndustryModule {}