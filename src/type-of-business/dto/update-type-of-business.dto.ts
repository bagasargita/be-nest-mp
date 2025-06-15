import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeOfBusinessDto } from './create-type-of-business.dto';

export class UpdateTypeOfBusinessDto extends PartialType(CreateTypeOfBusinessDto) {}