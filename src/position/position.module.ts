import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Position])],
  providers: [PositionService],
  controllers: [PositionController],
  exports: [PositionService],
})
export class PositionModule {}