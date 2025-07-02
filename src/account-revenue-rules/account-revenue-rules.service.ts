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
}