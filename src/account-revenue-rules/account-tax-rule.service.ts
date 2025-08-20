import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountTaxRule } from './entities/account-tax-rule.entity';
import { CreateAccountTaxRuleDto, UpdateAccountTaxRuleDto } from './dto/account-tax-rule.dto';

@Injectable()
export class AccountTaxRuleService {
  constructor(
    @InjectRepository(AccountTaxRule)
    private accountTaxRuleRepository: Repository<AccountTaxRule>,
  ) {}

  async create(createDto: CreateAccountTaxRuleDto, username: string): Promise<AccountTaxRule> {
    const taxRule = this.accountTaxRuleRepository.create({
      ...createDto,
      created_by: username,
    });

    return await this.accountTaxRuleRepository.save(taxRule);
  }

  async findByAccountId(accountId: string): Promise<AccountTaxRule[]> {
    return await this.accountTaxRuleRepository.find({
      where: { 
        account_id: accountId,
        is_active: true 
      },
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AccountTaxRule> {
    const taxRule = await this.accountTaxRuleRepository.findOne({
      where: { id, is_active: true },
    });

    if (!taxRule) {
      throw new NotFoundException('Tax rule not found');
    }

    return taxRule;
  }

  async update(id: string, updateDto: UpdateAccountTaxRuleDto, username: string): Promise<AccountTaxRule> {
    const taxRule = await this.findOne(id);

    Object.assign(taxRule, {
      ...updateDto,
      updated_by: username,
    });

    return await this.accountTaxRuleRepository.save(taxRule);
  }

  async remove(id: string): Promise<void> {
    const taxRule = await this.findOne(id);
    taxRule.is_active = false;
    await this.accountTaxRuleRepository.save(taxRule);
  }

  async removeByAccountId(accountId: string): Promise<void> {
    await this.accountTaxRuleRepository.update(
      { account_id: accountId, is_active: true },
      { is_active: false }
    );
  }

  async createBulk(accountId: string, rules: Array<Omit<CreateAccountTaxRuleDto, 'account_id'>>, username: string): Promise<AccountTaxRule[]> {
    // First, deactivate existing tax rules for this account
    await this.removeByAccountId(accountId);

    // Create new tax rules
    const taxRules = rules.map(rule => 
      this.accountTaxRuleRepository.create({
        ...rule,
        account_id: accountId,
        created_by: username,
      })
    );

    return await this.accountTaxRuleRepository.save(taxRules);
  }
}
