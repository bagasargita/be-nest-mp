import { Test, TestingModule } from '@nestjs/testing';
import { AccountAddressService } from './account-address.service';

describe('AccountAddressService', () => {
  let service: AccountAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountAddressService],
    }).compile();

    service = module.get<AccountAddressService>(AccountAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
