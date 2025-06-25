import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountRevenueRule } from './entities/account-revenue-rule.entity';
import { CreateAccountRevenueRuleDto, AccountRuleDto } from './dto/create-account-revenue-rule.dto';
import { UpdateAccountRevenueRuleDto } from './dto/update-account-revenue-rule.dto';
import { FindAccountRevenueRuleDto } from './dto/find-account-revenue-rule.dto';
import { AccountServiceService } from '../account-service/account-service.service';

@Injectable()
export class AccountRevenueRuleService {
  constructor(
    @InjectRepository(AccountRevenueRule)
    private accountRevenueRuleRepository: Repository<AccountRevenueRule>,
    private accountServiceService: AccountServiceService,
  ) {}

  async create(createAccountRevenueRuleDto: CreateAccountRevenueRuleDto, username: string): Promise<{ success: boolean; data: AccountRevenueRule[] }> {
    const { account_id, account_service_id, rules } = createAccountRevenueRuleDto;

    // Verifikasi hubungan account-service
    await this.verifyAccountServiceRelation(account_id, account_service_id);

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

  async findByAccountAndService(findDto: FindAccountRevenueRuleDto): Promise<AccountRevenueRule[]> {
    const { account_id, account_service_id } = findDto;
    
    // Verifikasi hubungan account-service
    await this.verifyAccountServiceRelation(account_id, account_service_id);
    
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
      
      // Verifikasi hubungan account-service baru
      await this.verifyAccountServiceRelation(
        updateAccountRevenueRuleDto.account_id, 
        updateAccountRevenueRuleDto.account_service_id
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
  
  private async verifyAccountServiceRelation(accountId: string, accountServiceId: string): Promise<void> {
    try {
      const accountService = await this.accountServiceService.findOne(accountServiceId);

      if (!accountService || !accountService.account) {
        throw new BadRequestException('Invalid account service relation');
      }

      // Verifikasi account_id sesuai dengan account_service
      if (accountService.account.id !== accountId) {
        throw new BadRequestException('Account ID does not match with the Account Service relation');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid account service relation');
    }
  }
}