import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CashLogisticsProviderService } from './cash-logistics-provider.service';
import { CreateCashLogisticsProviderDto } from './dto/create-cash-logistics-provider.dto';
import { UpdateCashLogisticsProviderDto } from './dto/update-cash-logistics-provider.dto';

@Controller('cash-logistics-provider')
export class CashLogisticsProviderController {
  constructor(private readonly cashLogisticsProviderService: CashLogisticsProviderService) {}

  @Post()
  create(@Body() createCashLogisticsProviderDto: CreateCashLogisticsProviderDto) {
    return this.cashLogisticsProviderService.create(createCashLogisticsProviderDto);
  }

  @Get()
  findAll() {
    return this.cashLogisticsProviderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashLogisticsProviderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCashLogisticsProviderDto: UpdateCashLogisticsProviderDto) {
    return this.cashLogisticsProviderService.update(+id, updateCashLogisticsProviderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashLogisticsProviderService.remove(+id);
  }
}
