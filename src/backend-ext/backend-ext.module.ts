import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { BackendExtService } from './backend-ext.service';
import { BackendExtController } from './backend-ext.controller';
import { BackendExt } from './entities/backend-ext.entity';
import { BackendExtLog } from './entities/backend-ext-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BackendExt, BackendExtLog]),
    HttpModule.register({
      timeout: 30000, // 30 seconds timeout
      maxRedirects: 5,
    }),
  ],
  controllers: [BackendExtController],
  providers: [BackendExtService],
  exports: [BackendExtService],
})
export class BackendExtModule {}
