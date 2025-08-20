import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AccountRevenueRuleService } from './account-revenue-rules.service';
import { CreateAccountRevenueRuleDto, CreateAccountRevenueRuleTreeDto } from './dto/create-account-revenue-rule.dto';
import { UpdateAccountRevenueRuleDto } from './dto/update-account-revenue-rule.dto';
import { CreateAccountPackageTierDto, UpdateAccountPackageTierDto } from './dto/account-package-tier.dto';
import { CreateAccountBillingMethodDto, UpdateAccountBillingMethodDto } from './dto/account-billing-method.dto';
import { CreateAccountTaxRuleDto, UpdateAccountTaxRuleDto } from './dto/account-tax-rule.dto';
import { CreateAccountTermOfPaymentDto, UpdateAccountTermOfPaymentDto } from './dto/account-term-of-payment.dto';
import { CreateAccountAddOnsDto, UpdateAccountAddOnsDto } from './dto/account-add-ons.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../infrastructure/guards/auth.guard';
import { AccountRevenueRule } from './entities/account-revenue-rule.entity';
import { AccountPackageTierService } from './account-package-tier.service';
import { AccountBillingMethodService } from './account-billing-method.service';
import { AccountTaxRuleService } from './account-tax-rule.service';
import { AccountTermOfPaymentService } from './account-term-of-payment.service';
import { AccountAddOnsService } from './account-add-ons.service';

@ApiBearerAuth()
@ApiTags('Revenue Rules')
@UseGuards(JwtAuthGuard)
@Controller('account-revenue-rules')
export class AccountRevenueRuleController {
  constructor(
    private readonly accountRevenueRuleService: AccountRevenueRuleService,
    private readonly accountPackageTierService: AccountPackageTierService,
    private readonly accountBillingMethodService: AccountBillingMethodService,
    private readonly accountTaxRuleService: AccountTaxRuleService,
    private readonly accountTermOfPaymentService: AccountTermOfPaymentService,
    private readonly accountAddOnsService: AccountAddOnsService,
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

  // Billing Method endpoints
  @Post('billing-methods')
  @ApiOperation({ summary: 'Create a new billing method' })
  @ApiResponse({ status: 201, description: 'Billing method created successfully' })
  createBillingMethod(@Body() createDto: CreateAccountBillingMethodDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.accountBillingMethodService.create(createDto, username);
  }

  @Get('billing-methods/account/:accountId')
  @ApiOperation({ summary: 'Get all billing methods for an account' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({ status: 200, description: 'Return all billing methods for the account' })
  getBillingMethodsByAccount(@Param('accountId') accountId: string) {
    return this.accountBillingMethodService.findByAccountId(accountId);
  }

  @Get('billing-methods/:id')
  @ApiOperation({ summary: 'Get a billing method by ID' })
  @ApiParam({ name: 'id', description: 'Billing Method ID' })
  @ApiResponse({ status: 200, description: 'Return a billing method' })
  getBillingMethod(@Param('id') id: string) {
    return this.accountBillingMethodService.findOne(id);
  }

  @Patch('billing-methods/:id')
  @ApiOperation({ summary: 'Update a billing method' })
  @ApiParam({ name: 'id', description: 'Billing Method ID' })
  @ApiResponse({ status: 200, description: 'Billing method updated successfully' })
  updateBillingMethod(@Param('id') id: string, @Body() updateDto: UpdateAccountBillingMethodDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.accountBillingMethodService.update(id, updateDto, username);
  }

  @Delete('billing-methods/:id')
  @ApiOperation({ summary: 'Delete a billing method' })
  @ApiParam({ name: 'id', description: 'Billing Method ID' })
  @ApiResponse({ status: 200, description: 'Billing method deleted successfully' })
  removeBillingMethod(@Param('id') id: string) {
    return this.accountBillingMethodService.remove(id);
  }

  @Post('billing-methods/bulk/:accountId')
  @ApiOperation({ summary: 'Create multiple billing methods for an account' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({ status: 201, description: 'Billing methods created successfully' })
  createBulkBillingMethods(
    @Param('accountId') accountId: string,
    @Body() methods: Array<Omit<CreateAccountBillingMethodDto, 'account_id'>>,
    @Request() req
  ) {
    const username = req.user?.username || 'system';
    return this.accountBillingMethodService.createBulk(accountId, methods, username);
  }

  // Tax Rule endpoints
  @Post('tax-rules')
  @ApiOperation({ summary: 'Create a new tax rule' })
  @ApiResponse({ status: 201, description: 'Tax rule created successfully' })
  createTaxRule(@Body() createDto: CreateAccountTaxRuleDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.accountTaxRuleService.create(createDto, username);
  }

  @Get('tax-rules/account/:accountId')
  @ApiOperation({ summary: 'Get all tax rules for an account' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({ status: 200, description: 'Return all tax rules for the account' })
  getTaxRulesByAccount(@Param('accountId') accountId: string) {
    return this.accountTaxRuleService.findByAccountId(accountId);
  }

  @Get('tax-rules/:id')
  @ApiOperation({ summary: 'Get a tax rule by ID' })
  @ApiParam({ name: 'id', description: 'Tax Rule ID' })
  @ApiResponse({ status: 200, description: 'Return a tax rule' })
  getTaxRule(@Param('id') id: string) {
    return this.accountTaxRuleService.findOne(id);
  }

  @Patch('tax-rules/:id')
  @ApiOperation({ summary: 'Update a tax rule' })
  @ApiParam({ name: 'id', description: 'Tax Rule ID' })
  @ApiResponse({ status: 200, description: 'Tax rule updated successfully' })
  updateTaxRule(@Param('id') id: string, @Body() updateDto: UpdateAccountTaxRuleDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.accountTaxRuleService.update(id, updateDto, username);
  }

  @Delete('tax-rules/:id')
  @ApiOperation({ summary: 'Delete a tax rule' })
  @ApiParam({ name: 'id', description: 'Tax Rule ID' })
  @ApiResponse({ status: 200, description: 'Tax rule deleted successfully' })
  removeTaxRule(@Param('id') id: string) {
    return this.accountTaxRuleService.remove(id);
  }

  @Post('tax-rules/bulk/:accountId')
  @ApiOperation({ summary: 'Create multiple tax rules for an account' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({ status: 201, description: 'Tax rules created successfully' })
  createBulkTaxRules(
    @Param('accountId') accountId: string,
    @Body() rules: Array<Omit<CreateAccountTaxRuleDto, 'account_id'>>,
    @Request() req
  ) {
    const username = req.user?.username || 'system';
    return this.accountTaxRuleService.createBulk(accountId, rules, username);
  }

  // Term of Payment endpoints
  @Post('term-of-payment')
  @ApiOperation({ summary: 'Create a new term of payment' })
  @ApiResponse({ status: 201, description: 'Term of payment created successfully' })
  createTermOfPayment(@Body() createDto: CreateAccountTermOfPaymentDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.accountTermOfPaymentService.create(createDto, username);
  }

  @Get('term-of-payment/account/:accountId')
  @ApiOperation({ summary: 'Get all terms of payment for an account' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({ status: 200, description: 'Return all terms of payment for the account' })
  getTermOfPaymentByAccount(@Param('accountId') accountId: string) {
    return this.accountTermOfPaymentService.findByAccountId(accountId);
  }

  @Get('term-of-payment/:id')
  @ApiOperation({ summary: 'Get a term of payment by ID' })
  @ApiParam({ name: 'id', description: 'Term of Payment ID' })
  @ApiResponse({ status: 200, description: 'Return a term of payment' })
  getTermOfPayment(@Param('id') id: string) {
    return this.accountTermOfPaymentService.findOne(id);
  }

  @Patch('term-of-payment/:id')
  @ApiOperation({ summary: 'Update a term of payment' })
  @ApiParam({ name: 'id', description: 'Term of Payment ID' })
  @ApiResponse({ status: 200, description: 'Term of payment updated successfully' })
  updateTermOfPayment(@Param('id') id: string, @Body() updateDto: UpdateAccountTermOfPaymentDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.accountTermOfPaymentService.update(id, updateDto, username);
  }

  @Delete('term-of-payment/:id')
  @ApiOperation({ summary: 'Delete a term of payment' })
  @ApiParam({ name: 'id', description: 'Term of Payment ID' })
  @ApiResponse({ status: 200, description: 'Term of payment deleted successfully' })
  removeTermOfPayment(@Param('id') id: string) {
    return this.accountTermOfPaymentService.remove(id);
  }

  @Post('term-of-payment/create-or-update/:accountId')
  @ApiOperation({ summary: 'Create or update term of payment for an account' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({ status: 201, description: 'Term of payment created or updated successfully' })
  createOrUpdateTermOfPayment(
    @Param('accountId') accountId: string,
    @Body() termData: Omit<CreateAccountTermOfPaymentDto, 'account_id'>,
    @Request() req
  ) {
    const username = req.user?.username || 'system';
    return this.accountTermOfPaymentService.createOrUpdate(accountId, termData, username);
  }

  // Add-Ons endpoints
  @Post('add-ons')
  @ApiOperation({ summary: 'Create a new add-on' })
  @ApiResponse({ status: 201, description: 'Add-on created successfully' })
  createAddOns(@Body() createDto: CreateAccountAddOnsDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.accountAddOnsService.create(createDto, username);
  }

  @Get('add-ons/account/:accountId')
  @ApiOperation({ summary: 'Get all add-ons for an account' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({ status: 200, description: 'Return all add-ons for the account' })
  getAddOnsByAccount(@Param('accountId') accountId: string) {
    return this.accountAddOnsService.findByAccountId(accountId);
  }

  @Get('add-ons/account/:accountId/type/:addOnsType')
  @ApiOperation({ summary: 'Get add-ons by account and type' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiParam({ name: 'addOnsType', description: 'Add-ons Type (system_integration or infrastructure)' })
  @ApiResponse({ status: 200, description: 'Return add-ons by account and type' })
  getAddOnsByType(@Param('accountId') accountId: string, @Param('addOnsType') addOnsType: 'system_integration' | 'infrastructure') {
    return this.accountAddOnsService.findByType(accountId, addOnsType);
  }

  @Get('add-ons/account/:accountId/billing/:billingType')
  @ApiOperation({ summary: 'Get add-ons by account and billing type' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiParam({ name: 'billingType', description: 'Billing Type (otc or monthly)' })
  @ApiResponse({ status: 200, description: 'Return add-ons by account and billing type' })
  getAddOnsByBillingType(@Param('accountId') accountId: string, @Param('billingType') billingType: 'otc' | 'monthly') {
    return this.accountAddOnsService.findByBillingType(accountId, billingType);
  }

  @Get('add-ons/:id')
  @ApiOperation({ summary: 'Get an add-on by ID' })
  @ApiParam({ name: 'id', description: 'Add-on ID' })
  @ApiResponse({ status: 200, description: 'Return an add-on' })
  getAddOns(@Param('id') id: string) {
    return this.accountAddOnsService.findOne(id);
  }

  @Patch('add-ons/:id')
  @ApiOperation({ summary: 'Update an add-on' })
  @ApiParam({ name: 'id', description: 'Add-on ID' })
  @ApiResponse({ status: 200, description: 'Add-on updated successfully' })
  updateAddOns(@Param('id') id: string, @Body() updateDto: UpdateAccountAddOnsDto, @Request() req) {
    const username = req.user?.username || 'system';
    return this.accountAddOnsService.update(id, updateDto, username);
  }

  @Delete('add-ons/:id')
  @ApiOperation({ summary: 'Delete an add-on' })
  @ApiParam({ name: 'id', description: 'Add-on ID' })
  @ApiResponse({ status: 200, description: 'Add-on deleted successfully' })
  removeAddOns(@Param('id') id: string) {
    return this.accountAddOnsService.remove(id);
  }

  @Post('add-ons/bulk/:accountId')
  @ApiOperation({ summary: 'Create multiple add-ons for an account' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({ status: 201, description: 'Add-ons created successfully' })
  createBulkAddOns(
    @Param('accountId') accountId: string,
    @Body() addOnsList: Array<Omit<CreateAccountAddOnsDto, 'account_id'>>,
    @Request() req
  ) {
    const username = req.user?.username || 'system';
    return this.accountAddOnsService.createBulk(accountId, addOnsList, username);
  }
}