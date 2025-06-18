import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus, 
  ParseIntPipe,
  Query 
} from '@nestjs/common';
import { SettlementMethodService } from './settlement-method.service';

// Entities
import { SettlementMethod } from './settlement-method.entity';
import { CashDepositMethod } from './cash-deposit-method.entity';
import { NonCashMethod } from './non-cash-method.entity';
import { SendMoneyMethod } from './send-money-method.entity';
import { SendGoodsMethod } from './send-good-method.entity';
import { BatchingDetail } from './batching-detail.entity';

// DTOs
import { CreateSettlementMethodDto } from './dto/create.dto';
import { UpdateSettlementMethodDto } from './dto/update.dto';
import { 
  CreateCashDepositMethodDto, 
  UpdateCashDepositMethodDto 
} from './dto/cash-deposit-method.dto';
import { 
  CreateNonCashMethodDto, 
  UpdateNonCashMethodDto 
} from './dto/non-cash-method.dto';
import { 
  CreateSendMoneyMethodDto, 
  UpdateSendMoneyMethodDto 
} from './dto/send-money-method.dto';
import { 
  CreateSendGoodsMethodDto, 
  UpdateSendGoodsMethodDto 
} from './dto/send-goods-method.dto';
import { 
  CreateBatchingDetailDto, 
  UpdateBatchingDetailDto 
} from './dto/batching-detail.dto';

type EntityType = 
  | SettlementMethod 
  | CashDepositMethod 
  | NonCashMethod 
  | SendMoneyMethod 
  | SendGoodsMethod
  | BatchingDetail;

@Controller('settlement-methods')
export class SettlementMethodController {
  constructor(private readonly service: SettlementMethodService) {}

  // ========== Settlement Method Endpoints ==========

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createSettlementMethod(
    @Body() createDto: CreateSettlementMethodDto
  ): Promise<SettlementMethod> {
    return this.service.create(createDto);
  }

  @Get()
  findAllSettlementMethods(): Promise<SettlementMethod[]> {
    return this.service.findAllSettlementMethods();
  }

  @Get(':id')
  findOneSettlementMethod(
    @Param('id', ParseIntPipe) id: number
  ): Promise<SettlementMethod> {
    return this.service.findOneSettlementMethod(id);
  }

  @Patch(':id')
  updateSettlementMethod(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateDto: UpdateSettlementMethodDto
  ): Promise<SettlementMethod> {
    return this.service.updateSettlementMethod(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSettlementMethod(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    await this.service.removeSettlementMethod(id);
  }

  // ========== Cash Deposit Method Endpoints ==========
  
  @Post('cash-deposit-methods')
  @HttpCode(HttpStatus.CREATED)
  createCashDepositMethod(
    @Body() createDto: CreateCashDepositMethodDto
  ): Promise<CashDepositMethod> {
    return this.service.createCashDepositMethod(createDto);
  }

  @Get('cash-deposit-methods')
  findAllCashDepositMethods(): Promise<CashDepositMethod[]> {
    return this.service.findAllCashDepositMethods();
  }

  @Get('cash-deposit-methods/:id')
  findOneCashDepositMethod(
    @Param('id', ParseIntPipe) id: number
  ): Promise<CashDepositMethod> {
    return this.service.findOneCashDepositMethod(id);
  }

  @Patch('cash-deposit-methods/:id')
  updateCashDepositMethod(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCashDepositMethodDto
  ): Promise<CashDepositMethod> {
    return this.service.updateCashDepositMethod(id, updateDto);
  }

  @Delete('cash-deposit-methods/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCashDepositMethod(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    await this.service.removeCashDepositMethod(id);
  }

  // ========== Non-Cash Method Endpoints ==========
  
  @Post('non-cash-methods')
  @HttpCode(HttpStatus.CREATED)
  createNonCashMethod(
    @Body() createDto: CreateNonCashMethodDto
  ): Promise<NonCashMethod> {
    return this.service.createNonCashMethod(createDto);
  }

  @Get('non-cash-methods')
  findAllNonCashMethods(): Promise<NonCashMethod[]> {
    return this.service.findAllNonCashMethods();
  }

  @Get('non-cash-methods/:id')
  findOneNonCashMethod(
    @Param('id', ParseIntPipe) id: number
  ): Promise<NonCashMethod> {
    return this.service.findOneNonCashMethod(id);
  }

  @Patch('non-cash-methods/:id')
  updateNonCashMethod(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateNonCashMethodDto
  ): Promise<NonCashMethod> {
    return this.service.updateNonCashMethod(id, updateDto);
  }

  @Delete('non-cash-methods/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeNonCashMethod(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    await this.service.removeNonCashMethod(id);
  }

  // ========== Send Money Method Endpoints ==========
  
  @Post('send-money-methods')
  @HttpCode(HttpStatus.CREATED)
  createSendMoneyMethod(
    @Body() createDto: CreateSendMoneyMethodDto
  ): Promise<SendMoneyMethod> {
    return this.service.createSendMoneyMethod(createDto);
  }

  @Get('send-money-methods')
  findAllSendMoneyMethods(): Promise<SendMoneyMethod[]> {
    return this.service.findAllSendMoneyMethods();
  }

  @Get('send-money-methods/:id')
  findOneSendMoneyMethod(
    @Param('id', ParseIntPipe) id: number
  ): Promise<SendMoneyMethod> {
    return this.service.findOneSendMoneyMethod(id);
  }

  @Patch('send-money-methods/:id')
  updateSendMoneyMethod(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSendMoneyMethodDto
  ): Promise<SendMoneyMethod> {
    return this.service.updateSendMoneyMethod(id, updateDto);
  }

  @Delete('send-money-methods/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSendMoneyMethod(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    await this.service.removeSendMoneyMethod(id);
  }

  // ========== Send Goods Method Endpoints ==========
  
  @Post('send-goods-methods')
  @HttpCode(HttpStatus.CREATED)
  createSendGoodsMethod(
    @Body() createDto: CreateSendGoodsMethodDto
  ): Promise<SendGoodsMethod> {
    return this.service.createSendGoodsMethod(createDto);
  }

  @Get('send-goods-methods')
  findAllSendGoodsMethods(): Promise<SendGoodsMethod[]> {
    return this.service.findAllSendGoodsMethods();
  }

  @Get('send-goods-methods/:id')
  findOneSendGoodsMethod(
    @Param('id', ParseIntPipe) id: number
  ): Promise<SendGoodsMethod> {
    return this.service.findOneSendGoodsMethod(id);
  }

  @Patch('send-goods-methods/:id')
  updateSendGoodsMethod(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSendGoodsMethodDto
  ): Promise<SendGoodsMethod> {
    return this.service.updateSendGoodsMethod(id, updateDto);
  }

  @Delete('send-goods-methods/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSendGoodsMethod(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    await this.service.removeSendGoodsMethod(id);
  }

  // ========== Batching Detail Endpoints ==========
  
  @Post('batching-details')
  @HttpCode(HttpStatus.CREATED)
  createBatchingDetail(
    @Body() createDto: CreateBatchingDetailDto
  ): Promise<BatchingDetail> {
    return this.service.createBatchingDetail(createDto);
  }

  @Get('batching-details')
  findAllBatchingDetails(): Promise<BatchingDetail[]> {
    return this.service.findAllBatchingDetails();
  }

  @Get('batching-details/:id')
  findOneBatchingDetail(
    @Param('id', ParseIntPipe) id: number
  ): Promise<BatchingDetail> {
    return this.service.findOneBatchingDetail(id);
  }

  @Patch('batching-details/:id')
  updateBatchingDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateBatchingDetailDto
  ): Promise<BatchingDetail> {
    return this.service.updateBatchingDetail(id, updateDto);
  }

  @Delete('batching-details/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeBatchingDetail(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    await this.service.removeBatchingDetail(id);
  }
}