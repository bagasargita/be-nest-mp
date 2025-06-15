import { Test, TestingModule } from '@nestjs/testing';
import { AccountBankService } from './account-bank.service';

describe('AccountBankService', () => {
  let service: AccountBankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountBankService],
    }).compile();

    service = module.get<AccountBankService>(AccountBankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
