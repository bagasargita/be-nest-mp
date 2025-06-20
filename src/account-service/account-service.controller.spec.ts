import { Test, TestingModule } from '@nestjs/testing';
import { AccountServiceController } from './account-service.controller';
import { AccountServiceService } from './account-service.service';

describe('AccountServiceController', () => {
  let controller: AccountServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountServiceController],
      providers: [AccountServiceService],
    }).compile();

    controller = module.get<AccountServiceController>(AccountServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
