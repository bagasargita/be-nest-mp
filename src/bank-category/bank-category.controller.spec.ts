import { Test, TestingModule } from '@nestjs/testing';
import { BankCategoryController } from './bank-category.controller';
import { BankCategoryService } from './bank-category.service';

describe('BankCategoryController', () => {
  let controller: BankCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankCategoryController],
      providers: [BankCategoryService],
    }).compile();

    controller = module.get<BankCategoryController>(BankCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
