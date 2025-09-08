import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublishedPackageTierController } from './published-package-tier.controller';
import { PublishedPackageTierService } from './published-package-tier.service';
import { PublishedPackageTier } from './entities/published-package-tier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublishedPackageTier])],
  controllers: [PublishedPackageTierController],
  providers: [PublishedPackageTierService],
  exports: [PublishedPackageTierService],
})
export class PublishedPackageTierModule {}
