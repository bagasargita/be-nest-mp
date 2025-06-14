import { Test, TestingModule } from '@nestjs/testing';
import { BankCategoryService } from './bank-category.service';

describe('BankCategoryService', () => {
  let service: BankCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankCategoryService],
    }).compile();

    service = module.get<BankCategoryService>(BankCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
