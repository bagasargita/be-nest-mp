import { PartialType } from '@nestjs/swagger';
import { CreateBackendExtDto } from './create-backend-ext.dto';

export class UpdateBackendExtDto extends PartialType(CreateBackendExtDto) {}
