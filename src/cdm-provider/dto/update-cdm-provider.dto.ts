import { PartialType } from '@nestjs/swagger';
import { CreateCdmProviderDto } from './create-cdm-provider.dto';

export class UpdateCdmProviderDto extends PartialType(CreateCdmProviderDto) {}
