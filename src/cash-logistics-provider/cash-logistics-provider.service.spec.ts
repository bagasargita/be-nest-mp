import { Test, TestingModule } from '@nestjs/testing';
import { CashLogisticsProviderService } from './cash-logistics-provider.service';

describe('CashLogisticsProviderService', () => {
  let service: CashLogisticsProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashLogisticsProviderService],
    }).compile();

    service = module.get<CashLogisticsProviderService>(CashLogisticsProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
