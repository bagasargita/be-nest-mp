import { Test, TestingModule } from '@nestjs/testing';
import { CashLogisticsProviderController } from './cash-logistics-provider.controller';
import { CashLogisticsProviderService } from './cash-logistics-provider.service';

describe('CashLogisticsProviderController', () => {
  let controller: CashLogisticsProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashLogisticsProviderController],
      providers: [CashLogisticsProviderService],
    }).compile();

    controller = module.get<CashLogisticsProviderController>(CashLogisticsProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
