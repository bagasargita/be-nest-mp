import { Test, TestingModule } from '@nestjs/testing';
import { AccountBankController } from './account-bank.controller';
import { AccountBankService } from './account-bank.service';

describe('AccountBankController', () => {
  let controller: AccountBankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountBankController],
      providers: [AccountBankService],
    }).compile();

    controller = module.get<AccountBankController>(AccountBankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
