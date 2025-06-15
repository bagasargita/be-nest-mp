import { Test, TestingModule } from '@nestjs/testing';
import { AccountPicController } from './account-pic.controller';
import { AccountPicService } from './account-pic.service';

describe('AccountPicController', () => {
  let controller: AccountPicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountPicController],
      providers: [AccountPicService],
    }).compile();

    controller = module.get<AccountPicController>(AccountPicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
