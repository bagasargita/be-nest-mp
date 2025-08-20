import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountRevenueRule } from './entities/account-revenue-rule.entity';
import { AccountRevenueRuleTree } from './entities/account-revenue-rule-tree.entity';
import { CreateAccountRevenueRuleDto, AccountRuleDto, CreateAccountRevenueRuleTreeDto } from './dto/create-account-revenue-rule.dto';
import { UpdateAccountRevenueRuleDto } from './dto/update-account-revenue-rule.dto';
import { FindAccountRevenueRuleDto } from './dto/find-account-revenue-rule.dto';
import { AccountServiceService } from '../account-service/account-service.service';
import { AccountService } from 'src/account-service/entities/account-service.entity';

@Injectable()
export class AccountRevenueRuleService {
  constructor(
    @InjectRepository(AccountRevenueRule)
    private accountRevenueRuleRepository: Repository<AccountRevenueRule>,
    @InjectRepository(AccountRevenueRuleTree)
    private accountRevenueRuleTreeRepository: Repository<AccountRevenueRuleTree>,
    private accountServiceService: AccountServiceService,
  ) {}

  // Tree structure methods
  async createFromTree(createDto: CreateAccountRevenueRuleTreeDto, username: string): Promise<{ success: boolean; data: any }> {
    const { account_id, account_service_id, charging_metric, billing_rules } = createDto;

    // Check if account_service_id is provided
    let accountServiceId = account_service_id;
    
    // First, try to find if account_service_id is actually an account service ID
    let accountService = await this.accountServiceService.findByAccountServiceId(account_service_id);
    
    if (accountService) {
      // account_service_id is already an account service ID
      accountServiceId = accountService.id;
    } else {
      // account_service_id is a service_id, we need to find or create the account service relationship
      try {
        // Try to verify the account service relation
        const accountServices = await this.verifyAccountServiceRelation(account_service_id, account_id);
        accountServiceId = accountServices[0].id;
      } catch (error) {
        try {
          // Create the account service relationship
          const newAccountService = await this.accountServiceService.create({
            account_id: account_id,
            service_id: account_service_id,
          }, username);
          
          accountServiceId = newAccountService.id;
        } catch (createError) {
          console.error('Failed to create account service relationship:', createError);
          throw new BadRequestException('Failed to create account service relationship. Please ensure the service exists and try again.');
        }
      }
    }
    
    // Find existing tree rule by account_service_id 
    const treeRule = await this.accountRevenueRuleTreeRepository.findOne({
      where: {
        account_service_id: accountServiceId,
        is_active: true,
      }
    });

    if (treeRule) {
      // Update existing rule
      treeRule.charging_metric = charging_metric || treeRule.charging_metric;
      treeRule.billing_rules = billing_rules || treeRule.billing_rules;
      treeRule.updated_by = username;
      treeRule.updated_at = new Date();

      const updatedTreeRule = await this.accountRevenueRuleTreeRepository.save(treeRule);
      
      return {
        success: true,
        data: {
          id: updatedTreeRule.id,
          account_id: updatedTreeRule.account_id,
          account_service_id: updatedTreeRule.account_service_id,
          charging_metric: updatedTreeRule.charging_metric,
          billing_rules: updatedTreeRule.billing_rules,
          updated_by: updatedTreeRule.updated_by,
          updated_at: updatedTreeRule.updated_at,
        },
      };
    }

    // Deactivate existing tree rules for this account-service pair
    await this.accountRevenueRuleTreeRepository.update(
      { 
        account_id, 
        account_service_id: accountServiceId,
        is_active: true
      },
      { is_active: false }
    );

    // Create new tree rule
    const newTreeRule = this.accountRevenueRuleTreeRepository.create({
      account_id,
      account_service_id: accountServiceId,
      charging_metric: charging_metric || {},
      billing_rules: billing_rules || {},
      is_active: true,
      created_by: username,
      created_at: new Date(),
    });

    const savedRule = await this.accountRevenueRuleTreeRepository.save(newTreeRule);

    return {
      success: true,
      data: {
        id: savedRule.id,
        account_id: savedRule.account_id,
        account_service_id: savedRule.account_service_id,
        charging_metric: savedRule.charging_metric,
        billing_rules: savedRule.billing_rules,
        created_by: savedRule.created_by,
        created_at: savedRule.created_at,
      },
    };
  }

  async findByAccountAndServiceAsTree(findDto: FindAccountRevenueRuleDto): Promise<{ success: boolean; data: any }> {
    const { account_id, account_service_id } = findDto;
    
    // Try to find the actual account service relationship ID
    let finalAccountServiceId = account_service_id;
    
    // First, try to find the account service by ID (assuming it's an account_service_id)
    let accountService = await this.accountServiceService.findOne(account_service_id);
    
    // If not found by ID, it might be a service_id, so try to find by account_id and service_id
    if (!accountService) {
      // Try to find accout service by account_id and service_id
      const accountServices = await this.accountServiceService.findByAccountId(account_id);
      const foundAccountService = accountServices.find(as => as.service?.id === account_service_id);
      
      if (!foundAccountService) {
        return {
          success: true,
          data: {
            charging_metric: null,
            billing_rules: null,
          },
        };
      }
      
      accountService = foundAccountService;
      finalAccountServiceId = accountService.id;
    }
    
    // Now search for tree rules using the actual account service relationship ID
    const treeRule = await this.accountRevenueRuleTreeRepository.findOne({
      where: {
        account_id,
        account_service_id: finalAccountServiceId,
        is_active: true,
      },
      relations: ['account', 'accountService'],
    });

    if (!treeRule) {
      // Return empty structure if no rules found
      return {
        success: true,
        data: {
          charging_metric: null,
          billing_rules: null,
        },
      };
    }

    return {
      success: true,
      data: {
        charging_metric: treeRule.charging_metric,
        billing_rules: treeRule.billing_rules,
      },
    };
  }

  async findTreeRuleById(id: string): Promise<AccountRevenueRuleTree> {
    const treeRule = await this.accountRevenueRuleTreeRepository.findOne({
      where: { id, is_active: true },
      relations: ['account', 'accountService'],
    });
    
    if (!treeRule) {
      throw new NotFoundException(`Tree revenue rule with ID ${id} not found`);
    }
    
    return treeRule;
  }

  async removeTree(id: string): Promise<{ success: boolean }> {
    const treeRule = await this.findTreeRuleById(id);
    
    // Soft delete
    treeRule.is_active = false;
    await this.accountRevenueRuleTreeRepository.save(treeRule);
    
    return { success: true };
  }

  // Existing flat structure methods (kept for backward compatibility)
  async create(createAccountRevenueRuleDto: CreateAccountRevenueRuleDto, username: string): Promise<{ success: boolean; data: AccountRevenueRule[] }> {
    const { account_id, account_service_id, rules } = createAccountRevenueRuleDto;

    // Verify account-service relation
    await this.verifyAccountServiceRelation(account_service_id, account_id);

    // Deactivate existing rules for this account-service pair
    await this.accountRevenueRuleRepository.update(
      { 
        account_id, 
        account_service_id,
        is_active: true
      },
      { is_active: false }
    );

    // Create new rules
    const createdRules = await Promise.all(
      rules.map(async (rule: AccountRuleDto) => {
        const newRule = this.accountRevenueRuleRepository.create({
          account_id,
          account_service_id,
          rule_category: rule.rule_category,
          rule_path: rule.rule_path,
          rule_value: rule.rule_value,
          is_active: true,
          created_by: username,
          created_at: new Date(),
        });
        return await this.accountRevenueRuleRepository.save(newRule);
      })
    );

    return {
      success: true,
      data: createdRules,
    };
  }

  async findAll(): Promise<AccountRevenueRule[]> {
    return this.accountRevenueRuleRepository.find({
      where: { is_active: true },
      relations: ['account', 'accountService'],
    });
  }

  private async verifyAccountServiceRelation(serviceId: string, accountId: string): Promise<AccountService[]> {
    try {
      const accountServices = await this.accountServiceService.findByServiceIdAndAccountId(serviceId, accountId);

      if (!accountServices || accountServices.length === 0) {
        throw new BadRequestException(`Account service relationship not found for service ${serviceId}`);
      }

      return accountServices;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error in verifyAccountServiceRelation:', error);
      throw new BadRequestException(`Invalid account service relation for service ${serviceId}`);
    }
  }

  async findByAccountAndService(findDto: FindAccountRevenueRuleDto): Promise<AccountRevenueRule[]> {
    const { account_id, account_service_id } = findDto;
    
    // Verify account-service relation
    await this.verifyAccountServiceRelation(account_service_id, account_id);
    
    return this.accountRevenueRuleRepository.find({
      where: {
        account_id,
        account_service_id,
        is_active: true,
      },
    });
  }

  async findOne(id: string): Promise<AccountRevenueRule> {
    const rule = await this.accountRevenueRuleRepository.findOne({
      where: { id, is_active: true },
      relations: ['account', 'accountService'],
    });
    
    if (!rule) {
      throw new NotFoundException(`Revenue rule with ID ${id} not found`);
    }
    
    return rule;
  }

  async update(id: string, updateAccountRevenueRuleDto: UpdateAccountRevenueRuleDto, username: string): Promise<AccountRevenueRule> {
    const rule = await this.findOne(id);
    
    if (updateAccountRevenueRuleDto.account_service_id && 
        updateAccountRevenueRuleDto.account_id &&
        (updateAccountRevenueRuleDto.account_service_id !== rule.account_service_id ||
         updateAccountRevenueRuleDto.account_id !== rule.account_id)) {
      
      // Verify new account-service relation
      await this.verifyAccountServiceRelation(
        updateAccountRevenueRuleDto.account_service_id,
        updateAccountRevenueRuleDto.account_id
      );
    }
    
    // Soft delete and create new approach
    if (updateAccountRevenueRuleDto.rules && updateAccountRevenueRuleDto.rules.length > 0) {
      // Deactivate old rule
      rule.is_active = false;
      await this.accountRevenueRuleRepository.save(rule);
      
      // Create new rules
      const account_id = updateAccountRevenueRuleDto.account_id || rule.account_id;
      const account_service_id = updateAccountRevenueRuleDto.account_service_id || rule.account_service_id;
      
      const newRules = updateAccountRevenueRuleDto.rules.map(ruleDto => {
        return this.accountRevenueRuleRepository.create({
          account_id,
          account_service_id,
          rule_category: ruleDto.rule_category,
          rule_path: ruleDto.rule_path,
          rule_value: ruleDto.rule_value,
          is_active: true,
          created_by: username,
          created_at: new Date(),
        });
      });
      
      const savedRules = await this.accountRevenueRuleRepository.save(newRules);
      return savedRules[0];
    }
    
    return rule;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const rule = await this.findOne(id);
    
    // Soft delete
    rule.is_active = false;
    await this.accountRevenueRuleRepository.save(rule);
    
    return { success: true };
  }

  async findByAccountAndBillingMethodType(accountId: string, billingMethodType: string): Promise<any> {
    // Import the repositories we need
    const { Repository } = await import('typeorm');
    const { InjectRepository } = await import('@nestjs/typeorm');
    const { AccountAddOns } = await import('./entities/account-add-ons.entity');
    const { AccountPackageTier } = await import('./entities/account-package-tier.entity');
    
    // Get data source to create query builders
    const dataSource = this.accountRevenueRuleRepository.manager.connection;
    
    // Query Add-Ons with billing method type filter
    const addOnsQuery = dataSource
      .createQueryBuilder()
      .select([
        'addons.id',
        'addons.account_id',
        'addons.add_ons_type',
        'addons.billing_type', 
        'addons.amount',
        'addons.description',
        'addons.start_date',
        'addons.end_date',
        'addons.billing_method_type',
        'addons.custom_fee',
        'addons.requires_custom_development',
        'addons.custom_development_fee',
        'addons.api_type',
        'addons.complexity_level',
        'addons.base_fee',
        'addons.is_active',
        'addons.created_by',
        'addons.created_at',
        'addons.updated_by',
        'addons.updated_at',
        'billing_method.id as billing_method_id',
        'billing_method.method as billing_method_name',
        'billing_method.description as billing_method_description'
      ])
      .from('m_account_add_ons', 'addons')
      .leftJoin('m_account_billing_method', 'billing_method', 'billing_method.id = addons.billing_method_id')
      .where('addons.account_id = :accountId', { accountId })
      .andWhere('addons.billing_method_type = :billingMethodType', { billingMethodType })
      .andWhere('addons.is_active = true');
    
    // Query Package Tiers - since they don't have billing_method_type, we get all for the account
    const packageTiersQuery = dataSource
      .createQueryBuilder()
      .select([
        'tiers.id',
        'tiers.account_id',
        'tiers.min_value',
        'tiers.max_value', 
        'tiers.amount',
        'tiers.start_date',
        'tiers.end_date',
        'tiers.is_active',
        'tiers.created_by',
        'tiers.created_at',
        'tiers.updated_by',
        'tiers.updated_at',
        'billing_method.id as billing_method_id',
        'billing_method.method as billing_method_name',
        'billing_method.description as billing_method_description'
      ])
      .from('m_account_package_tier', 'tiers')
      .leftJoin('m_account_billing_method', 'billing_method', 'billing_method.id = tiers.billing_method_id')
      .where('tiers.account_id = :accountId', { accountId })
      .andWhere('tiers.is_active = true');

    const [addOnsResults, packageTiersResults] = await Promise.all([
      addOnsQuery.getRawMany(),
      packageTiersQuery.getRawMany()
    ]);

    return {
      account_id: accountId,
      billing_method_type: billingMethodType,
      add_ons: addOnsResults.map(row => ({
        id: row.id,
        account_id: row.account_id,
        add_ons_type: row.add_ons_type,
        billing_type: row.billing_type,
        amount: parseFloat(row.amount),
        description: row.description,
        start_date: row.start_date,
        end_date: row.end_date,
        billing_method_type: row.billing_method_type,
        custom_fee: parseFloat(row.custom_fee),
        requires_custom_development: row.requires_custom_development,
        custom_development_fee: parseFloat(row.custom_development_fee),
        api_type: row.api_type,
        complexity_level: row.complexity_level,
        base_fee: row.base_fee ? parseFloat(row.base_fee) : null,
        is_active: row.is_active,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_by: row.updated_by,
        updated_at: row.updated_at,
        billing_method: row.billing_method_id ? {
          id: row.billing_method_id,
          method: row.billing_method_name,
          description: row.billing_method_description
        } : null
      })),
      package_tiers: packageTiersResults.map(row => ({
        id: row.id,
        account_id: row.account_id,
        min_value: parseFloat(row.min_value),
        max_value: parseFloat(row.max_value),
        amount: parseFloat(row.amount),
        start_date: row.start_date,
        end_date: row.end_date,
        is_active: row.is_active,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_by: row.updated_by,
        updated_at: row.updated_at,
        billing_method: row.billing_method_id ? {
          id: row.billing_method_id,
          method: row.billing_method_name,
          description: row.billing_method_description
        } : null
      }))
    };
  }
}