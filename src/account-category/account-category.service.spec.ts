import { Test, TestingModule } from '@nestjs/testing';
import { AccountCategoryService } from './account-category.service';

describe('AccountCategoryService', () => {
  let service: AccountCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountCategoryService],
    }).compile();

    service = module.get<AccountCategoryService>(AccountCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
