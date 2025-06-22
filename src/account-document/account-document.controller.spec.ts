import { Test, TestingModule } from '@nestjs/testing';
import { AccountDocumentController } from './account-document.controller';
import { AccountDocumentService } from './account-document.service';

describe('AccountDocumentController', () => {
  let controller: AccountDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountDocumentController],
      providers: [AccountDocumentService],
    }).compile();

    controller = module.get<AccountDocumentController>(AccountDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
