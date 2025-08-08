import { PartialType } from '@nestjs/swagger';
import { CreatePostalcodeDto } from './create-postalcode.dto';

export class UpdatePostalcodeDto extends PartialType(CreatePostalcodeDto) {}
