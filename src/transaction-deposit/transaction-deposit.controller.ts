import { Controller, Get, Post, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TransactionDepositService } from './transaction-deposit.service';
import { QueryTransactionDepositDto } from './dto/query-transaction-deposit.dto';
import { JwtAuthGuard } from '../infrastructure/guards/auth.guard';

@ApiTags('Transaction Deposit')
@Controller('transaction-deposit')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionDepositController {
  constructor(private readonly service: TransactionDepositService) {}

  @Get()
  @ApiOperation({ summary: 'Get transaction deposits with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Transaction deposits retrieved successfully' })
  async findAll(@Query() queryDto: QueryTransactionDepositDto) {
    return this.service.findAll(queryDto);
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync transaction deposits from external API' })
  @ApiResponse({ status: 200, description: 'Sync completed successfully' })
  @ApiQuery({ name: 'config_id', required: false, description: 'Backend-ext config ID (optional)' })
  async syncFromExternalApi(@Query('config_id') configId?: string) {
    return this.service.syncFromExternalApi(configId);
  }
}

