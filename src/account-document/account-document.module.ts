import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AccountDocumentService } from './account-document.service';
import { AccountDocumentController } from './account-document.controller';
import { AccountDocument } from './entities/account-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountDocument]),
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  ],
  controllers: [AccountDocumentController],
  providers: [AccountDocumentService],
  exports: [AccountDocumentService]
})
export class AccountDocumentModule {}