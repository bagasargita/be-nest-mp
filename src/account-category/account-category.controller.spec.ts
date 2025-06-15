import { Test, TestingModule } from '@nestjs/testing';
import { AccountCategoryController } from './account-category.controller';
import { AccountCategoryService } from './account-category.service';

describe('AccountCategoryController', () => {
  let controller: AccountCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountCategoryController],
      providers: [AccountCategoryService],
    }).compile();

    controller = module.get<AccountCategoryController>(AccountCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
