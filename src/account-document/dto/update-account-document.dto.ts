import { PartialType } from '@nestjs/swagger';
import { CreateAccountDocumentDto } from './create-account-document.dto';

export class UpdateAccountDocumentDto extends PartialType(CreateAccountDocumentDto) {}
