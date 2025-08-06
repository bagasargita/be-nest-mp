import { Injectable } from '@nestjs/common';
import { CreateCashLogisticsProviderDto } from './dto/create-cash-logistics-provider.dto';
import { UpdateCashLogisticsProviderDto } from './dto/update-cash-logistics-provider.dto';

@Injectable()
export class CashLogisticsProviderService {
  create(createCashLogisticsProviderDto: CreateCashLogisticsProviderDto) {
    return 'This action adds a new cashLogisticsProvider';
  }

  findAll() {
    return `This action returns all cashLogisticsProvider`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cashLogisticsProvider`;
  }

  update(id: number, updateCashLogisticsProviderDto: UpdateCashLogisticsProviderDto) {
    return `This action updates a #${id} cashLogisticsProvider`;
  }

  remove(id: number) {
    return `This action removes a #${id} cashLogisticsProvider`;
  }
}
