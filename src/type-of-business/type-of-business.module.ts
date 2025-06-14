import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOfBusiness } from './entities/type-of-business.entity';
import { TypeOfBusinessService } from './type-of-business.service';
import { TypeOfBusinessController } from './type-of-business.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOfBusiness])],
  providers: [TypeOfBusinessService],
  controllers: [TypeOfBusinessController],
  exports: [TypeOfBusinessService],
})
export class TypeOfBusinessModule {}