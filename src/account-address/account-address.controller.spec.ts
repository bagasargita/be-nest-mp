import { Test, TestingModule } from '@nestjs/testing';
import { AccountAddressController } from './account-address.controller';
import { AccountAddressService } from './account-address.service';

describe('AccountAddressController', () => {
  let controller: AccountAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountAddressController],
      providers: [AccountAddressService],
    }).compile();

    controller = module.get<AccountAddressController>(AccountAddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
