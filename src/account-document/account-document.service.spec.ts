import { Test, TestingModule } from '@nestjs/testing';
import { AccountDocumentService } from './account-document.service';

describe('AccountDocumentService', () => {
  let service: AccountDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountDocumentService],
    }).compile();

    service = module.get<AccountDocumentService>(AccountDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
