import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AccountRevenueRuleService } from './account-revenue-rules.service';
import { CreateAccountRevenueRuleDto } from './dto/create-account-revenue-rule.dto';
import { UpdateAccountRevenueRuleDto } from './dto/update-account-revenue-rule.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../infrastructure/guards/auth.guard';
import { AccountRevenueRule } from './entities/account-revenue-rule.entity';

@ApiTags('Revenue Rules')
@UseGuards(JwtAuthGuard)
@Controller('account-revenue-rules')
export class AccountRevenueRuleController {
  constructor(private readonly accountRevenueRuleService: AccountRevenueRuleService) {}

  @Post()
  @ApiOperation({ summary: 'Create revenue rules for an account-service pair' })
  @ApiResponse({ status: 201, description: 'Rules created successfully', type: AccountRevenueRule, isArray: true })
  create(@Body() createRevenueRuleDto: CreateAccountRevenueRuleDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.accountRevenueRuleService.create(createRevenueRuleDto, username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all revenue rules' })
  @ApiResponse({ status: 200, description: 'Return all revenue rules', type: AccountRevenueRule, isArray: true })
  async findAll() {
    const data = await this.accountRevenueRuleService.findAll();
    return {
      success: true,
      data,
    };
  }

  @Get('account/:accountId/service/:accountServiceId')
  @ApiOperation({ summary: 'Get revenue rules by account and service' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiParam({ name: 'accountServiceId', description: 'Account Service ID' })
  @ApiResponse({ status: 200, description: 'Return revenue rules by account and service', type: AccountRevenueRule, isArray: true })
  async findByAccountAndService(
    @Param('accountId') accountId: string,
    @Param('accountServiceId') accountServiceId: string,
  ) {
    const rules = await this.accountRevenueRuleService.findByAccountAndService({
      account_id: accountId,
      account_service_id: accountServiceId,
    });
    
    return {
      success: true,
      data: rules,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a revenue rule by ID' })
  @ApiParam({ name: 'id', description: 'Revenue Rule ID' })
  @ApiResponse({ status: 200, description: 'Return a revenue rule', type: AccountRevenueRule })
  async findOne(@Param('id') id: string) {
    const rule = await this.accountRevenueRuleService.findOne(id);
    
    return {
      success: true,
      data: rule,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a revenue rule' })
  @ApiParam({ name: 'id', description: 'Revenue Rule ID' })
  @ApiResponse({ status: 200, description: 'Rule updated successfully', type: AccountRevenueRule })
  update(
    @Param('id') id: string, 
    @Body() updateAccountRevenueRuleDto: UpdateAccountRevenueRuleDto,
    @Request() req
  ) {
    const username = req.user?.username || 'system';
    return this.accountRevenueRuleService.update(id, updateAccountRevenueRuleDto, username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a revenue rule' })
  @ApiParam({ name: 'id', description: 'Revenue Rule ID' })
  @ApiResponse({ status: 200, description: 'Rule deleted successfully' })
  remove(@Param('id') id: string) {
    return this.accountRevenueRuleService.remove(id);
  }
}