import { PartialType } from '@nestjs/swagger';
import { CreateMasterMachineDto } from './create-master-machine.dto';

export class UpdateMasterMachineDto extends PartialType(CreateMasterMachineDto) {}

