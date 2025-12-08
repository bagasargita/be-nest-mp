import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterMachine } from './entities/master-machine.entity';
import { MasterMachineService } from './master-machine.service';
import { MasterMachineController } from './master-machine.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MasterMachine])],
  providers: [MasterMachineService],
  controllers: [MasterMachineController],
  exports: [MasterMachineService],
})
export class MasterMachineModule {}

