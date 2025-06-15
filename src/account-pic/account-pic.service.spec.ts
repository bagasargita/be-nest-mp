import { Test, TestingModule } from '@nestjs/testing';
import { AccountPicService } from './account-pic.service';

describe('AccountPicService', () => {
  let service: AccountPicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountPicService],
    }).compile();

    service = module.get<AccountPicService>(AccountPicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
