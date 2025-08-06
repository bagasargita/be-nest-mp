import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CdmProviderService } from './cdm-provider.service';
import { CdmProviderController } from './cdm-provider.controller';
import { CdmProvider } from './entities/cdm-provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CdmProvider])],
  controllers: [CdmProviderController],
  providers: [CdmProviderService],
  exports: [CdmProviderService],
})
export class CdmProviderModule {}
