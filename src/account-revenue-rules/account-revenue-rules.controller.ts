import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AccountRevenueRuleService } from './account-revenue-rules.service';
import { CreateAccountRevenueRuleDto, CreateAccountRevenueRuleTreeDto } from './dto/create-account-revenue-rule.dto';
import { UpdateAccountRevenueRuleDto } from './dto/update-account-revenue-rule.dto';
import { CreateAccountPackageTierDto, UpdateAccountPackageTierDto } from './dto/account-package-tier.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../infrastructure/guards/auth.guard';
import { AccountRevenueRule } from './entities/account-revenue-rule.entity';
import { AccountPackageTierService } from './account-package-tier.service';

@ApiTags('Revenue Rules')
@UseGuards(JwtAuthGuard)
@Controller('account-revenue-rules')
export class AccountRevenueRuleController {
  constructor(
    private readonly accountRevenueRuleService: AccountRevenueRuleService,
    private readonly accountPackageTierService: AccountPackageTierService,
  ) {}

  // Tree structure endpoints
  @Post('tree')
  @ApiOperation({ summary: 'Create revenue rules using tree structure' })
  @ApiResponse({ status: 201, description: 'Rules created successfully from tree structure' })
  createFromTree(@Body() createTreeDto: CreateAccountRevenueRuleTreeDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.accountRevenueRuleService.createFromTree(createTreeDto, username);
  }

  @Get('tree/account/:accountId/service/:accountServiceId')
  @ApiOperation({ summary: 'Get revenue rules as tree structure by account and service' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiParam({ name: 'accountServiceId', description: 'Account Service ID' })
  @ApiResponse({ status: 200, description: 'Return revenue rules as tree structure' })
  async findByAccountAndServiceAsTree(
    @Param('accountId') accountId: string,
    @Param('accountServiceId') accountServiceId: string,
  ) {
    return this.accountRevenueRuleService.findByAccountAndServiceAsTree({
      account_id: accountId,
      account_service_id: accountServiceId,
    });
  }

  @Get('tree/:id')
  @ApiOperation({ summary: 'Get a tree revenue rule by ID' })
  @ApiParam({ name: 'id', description: 'Tree Revenue Rule ID' })
  @ApiResponse({ status: 200, description: 'Return a tree revenue rule' })
  async findTreeRuleById(@Param('id') id: string) {
    const rule = await this.accountRevenueRuleService.findTreeRuleById(id);
    
    return {
      success: true,
      data: {
        id: rule.id,
        account_id: rule.account_id,
        account_service_id: rule.account_service_id,
        charging_metric: rule.charging_metric,
        billing_rules: rule.billing_rules,
        is_active: rule.is_active,
        created_by: rule.created_by,
        created_at: rule.created_at,
        updated_by: rule.updated_by,
        updated_at: rule.updated_at,
      },
    };
  }

  @Delete('tree/:id')
  @ApiOperation({ summary: 'Delete a tree revenue rule' })
  @ApiParam({ name: 'id', description: 'Tree Revenue Rule ID' })
  @ApiResponse({ status: 200, description: 'Tree rule deleted successfully' })
  removeTree(@Param('id') id: string) {
    return this.accountRevenueRuleService.removeTree(id);
  }

  // Existing flat structure endpoints (for backward compatibility)
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

  // Package Tier endpoints
  @Post('package-tiers')
  @ApiOperation({ summary: 'Create a new package tier' })
  @ApiResponse({ status: 201, description: 'Package tier created successfully' })
  createPackageTier(@Body() createDto: CreateAccountPackageTierDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.accountPackageTierService.create(createDto, username);
  }

  @Get('package-tiers/account/:accountId')
  @ApiOperation({ summary: 'Get all package tiers for an account' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({ status: 200, description: 'Return all package tiers for the account' })
  getPackageTiersByAccount(@Param('accountId') accountId: string) {
    return this.accountPackageTierService.findByAccountId(accountId);
  }

  @Get('package-tiers/:id')
  @ApiOperation({ summary: 'Get a package tier by ID' })
  @ApiParam({ name: 'id', description: 'Package Tier ID' })
  @ApiResponse({ status: 200, description: 'Return a package tier' })
  getPackageTier(@Param('id') id: string) {
    return this.accountPackageTierService.findOne(id);
  }

  @Patch('package-tiers/:id')
  @ApiOperation({ summary: 'Update a package tier' })
  @ApiParam({ name: 'id', description: 'Package Tier ID' })
  @ApiResponse({ status: 200, description: 'Package tier updated successfully' })
  updatePackageTier(@Param('id') id: string, @Body() updateDto: UpdateAccountPackageTierDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.accountPackageTierService.update(id, updateDto, username);
  }

  @Delete('package-tiers/:id')
  @ApiOperation({ summary: 'Delete a package tier' })
  @ApiParam({ name: 'id', description: 'Package Tier ID' })
  @ApiResponse({ status: 200, description: 'Package tier deleted successfully' })
  removePackageTier(@Param('id') id: string) {
    return this.accountPackageTierService.remove(id);
  }

  @Post('package-tiers/bulk/:accountId')
  @ApiOperation({ summary: 'Create multiple package tiers for an account' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({ status: 201, description: 'Package tiers created successfully' })
  createBulkPackageTiers(
    @Param('accountId') accountId: string,
    @Body() tiers: Array<Omit<CreateAccountPackageTierDto, 'account_id'>>,
    @Request() req
  ) {
    const username = req.user?.username || 'system';
    return this.accountPackageTierService.createBulk(accountId, tiers, username);
  }
}