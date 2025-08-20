import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountBillingMethod } from './entities/account-billing-method.entity';
import { CreateAccountBillingMethodDto, UpdateAccountBillingMethodDto } from './dto/account-billing-method.dto';

@Injectable()
export class AccountBillingMethodService {
  constructor(
    @InjectRepository(AccountBillingMethod)
    private accountBillingMethodRepository: Repository<AccountBillingMethod>,
  ) {}

  async create(createDto: CreateAccountBillingMethodDto, username: string): Promise<AccountBillingMethod> {
    const billingMethod = this.accountBillingMethodRepository.create({
      ...createDto,
      created_by: username,
    });

    return await this.accountBillingMethodRepository.save(billingMethod);
  }

  async findByAccountId(accountId: string): Promise<AccountBillingMethod[]> {
    return await this.accountBillingMethodRepository.find({
      where: { 
        account_id: accountId,
        is_active: true 
      },
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AccountBillingMethod> {
    const billingMethod = await this.accountBillingMethodRepository.findOne({
      where: { id, is_active: true },
    });

    if (!billingMethod) {
      throw new NotFoundException('Billing method not found');
    }

    return billingMethod;
  }

  async update(id: string, updateDto: UpdateAccountBillingMethodDto, username: string): Promise<AccountBillingMethod> {
    const billingMethod = await this.findOne(id);

    Object.assign(billingMethod, {
      ...updateDto,
      updated_by: username,
    });

    return await this.accountBillingMethodRepository.save(billingMethod);
  }

  async remove(id: string): Promise<void> {
    const billingMethod = await this.findOne(id);
    billingMethod.is_active = false;
    await this.accountBillingMethodRepository.save(billingMethod);
  }

  async removeByAccountId(accountId: string): Promise<void> {
    await this.accountBillingMethodRepository.update(
      { account_id: accountId, is_active: true },
      { is_active: false }
    );
  }

  async createBulk(accountId: string, methods: Array<Omit<CreateAccountBillingMethodDto, 'account_id'>>, username: string): Promise<AccountBillingMethod[]> {
    console.log(`🔄 Processing ${methods.length} billing methods for account ${accountId}`);
    
    // Get existing billing methods for this account
    const existingMethods = await this.accountBillingMethodRepository.find({
      where: { account_id: accountId, is_active: true }
    });

    console.log(`📋 Found ${existingMethods.length} existing billing methods for account ${accountId}`);

    const results: AccountBillingMethod[] = [];

    // Process each method - UPDATE if exists, CREATE if doesn't exist
    for (const methodData of methods) {
      let existingMethod: AccountBillingMethod | undefined;

      // First try to find by ID if provided
      if (methodData.id) {
        existingMethod = existingMethods.find(existing => existing.id === methodData.id);
        console.log(`🔍 Looking for billing method by ID ${methodData.id}: ${existingMethod ? 'Found' : 'Not found'}`);
      }

      // If not found by ID, try to find by method name for this account
      if (!existingMethod && methodData.method) {
        existingMethod = existingMethods.find(existing => existing.method === methodData.method);
        if (existingMethod) {
          console.log(`🔍 Found billing method by method name "${methodData.method}": ID ${existingMethod.id}`);
        }
      }

      if (existingMethod) {
        // Update existing method
        console.log(`📝 Updating existing billing method ID: ${existingMethod.id}`);
        Object.assign(existingMethod, {
          method: methodData.method || existingMethod.method,
          description: methodData.description || existingMethod.description,
          updated_by: username,
        });
        const updated = await this.accountBillingMethodRepository.save(existingMethod);
        results.push(updated);
      } else {
        // Create new billing method
        console.log(`➕ Creating new billing method for account ${accountId} with method: ${methodData.method}`);
        const newMethod = this.accountBillingMethodRepository.create({
          account_id: accountId,
          method: methodData.method,
          description: methodData.description,
          created_by: username,
        });
        const saved = await this.accountBillingMethodRepository.save(newMethod);
        results.push(saved);
      }
    }

    console.log(`✅ Processed ${results.length} billing methods for account ${accountId}`);
    return results;
  }
}
