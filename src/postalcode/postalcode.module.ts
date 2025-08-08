import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Postalcode } from './entities/postalcode.entity';
import { PostalcodeService } from './postalcode.service';
import { PostalcodeController } from './postalcode.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Postalcode])],
  providers: [PostalcodeService],
  controllers: [PostalcodeController],
  exports: [PostalcodeService],
})
export class PostalcodeModule {}
