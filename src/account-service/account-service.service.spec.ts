import { Test, TestingModule } from '@nestjs/testing';
import { AccountServiceService } from './account-service.service';

describe('AccountServiceService', () => {
  let service: AccountServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountServiceService],
    }).compile();

    service = module.get<AccountServiceService>(AccountServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
