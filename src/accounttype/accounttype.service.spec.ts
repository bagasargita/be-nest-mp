import { Test, TestingModule } from '@nestjs/testing';
import { AccountTypeService } from './accounttype.service';

describe('AccountTypeService', () => {
  let service: AccountTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountTypeService],
    }).compile();

    service = module.get<AccountTypeService>(AccountTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
