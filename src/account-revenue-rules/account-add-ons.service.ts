import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountAddOns } from './entities/account-add-ons.entity';
import { CreateAccountAddOnsDto, UpdateAccountAddOnsDto } from './dto/account-add-ons.dto';

@Injectable()
export class AccountAddOnsService {
  constructor(
    @InjectRepository(AccountAddOns)
    private accountAddOnsRepository: Repository<AccountAddOns>,
  ) {}

  async create(createDto: CreateAccountAddOnsDto, username: string): Promise<AccountAddOns> {
    const addOns = this.accountAddOnsRepository.create({
      ...createDto,
      created_by: username,
    });

    return await this.accountAddOnsRepository.save(addOns);
  }

  async findByAccountId(accountId: string): Promise<AccountAddOns[]> {
    return await this.accountAddOnsRepository.find({
      where: { 
        account_id: accountId,
        is_active: true 
      },
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AccountAddOns> {
    const addOns = await this.accountAddOnsRepository.findOne({
      where: { id, is_active: true },
    });

    if (!addOns) {
      throw new NotFoundException('Add-ons not found');
    }

    return addOns;
  }

  async update(id: string, updateDto: UpdateAccountAddOnsDto, username: string): Promise<AccountAddOns> {
    const addOns = await this.findOne(id);

    Object.assign(addOns, {
      ...updateDto,
      updated_by: username,
    });

    return await this.accountAddOnsRepository.save(addOns);
  }

  async remove(id: string): Promise<void> {
    const addOns = await this.findOne(id);
    addOns.is_active = false;
    await this.accountAddOnsRepository.save(addOns);
  }

  async removeByAccountId(accountId: string): Promise<void> {
    await this.accountAddOnsRepository.update(
      { account_id: accountId, is_active: true },
      { is_active: false }
    );
  }

  async createBulk(accountId: string, addOnsList: Array<Omit<CreateAccountAddOnsDto, 'account_id'>>, username: string): Promise<AccountAddOns[]> {
    console.log(`🔄 Processing ${addOnsList.length} add-ons for account ${accountId}`);
    console.log(`📋 Received add-ons data:`, JSON.stringify(addOnsList, null, 2));
    
    // Get existing add-ons for this account
    const existingAddOns = await this.accountAddOnsRepository.find({
      where: { account_id: accountId, is_active: true }
    });

    console.log(`📊 Found ${existingAddOns.length} existing add-ons:`, existingAddOns.map(a => ({ id: a.id, type: a.add_ons_type })));

    const results: AccountAddOns[] = [];

    // Process each new add-on
    for (const addOnData of addOnsList) {
      let existingAddOn;
      
      // If ID is provided, find by ID (for updates)
      if (addOnData.id) {
        existingAddOn = existingAddOns.find(existing => existing.id === addOnData.id);
        console.log(`🔍 Looking for existing add-on with ID: ${addOnData.id}`);
      } else {
        // If no ID, find by type (for backward compatibility, but should be avoided)
        existingAddOn = existingAddOns.find(existing => 
          existing.add_ons_type === addOnData.add_ons_type
        );
        console.log(`🔍 Looking for existing add-on with type: ${addOnData.add_ons_type}`);
      }

      if (existingAddOn) {
        // Update existing add-on
        console.log(`🔄 Updating existing add-on with ID: ${existingAddOn.id}`);
        Object.assign(existingAddOn, {
          ...addOnData,
          id: existingAddOn.id, // Preserve original ID
          account_id: existingAddOn.account_id, // Preserve account_id
          created_at: existingAddOn.created_at, // Preserve created_at
          created_by: existingAddOn.created_by, // Preserve created_by
          updated_by: username,
        });
        const updated = await this.accountAddOnsRepository.save(existingAddOn);
        results.push(updated);
      } else {
        // Create new add-on
        console.log(`➕ Creating new add-on of type: ${addOnData.add_ons_type}`);
        const { id, ...addOnDataWithoutId } = addOnData; // Remove id if exists for new records
        const newAddOn = this.accountAddOnsRepository.create({
          ...addOnDataWithoutId,
          account_id: accountId,
          created_by: username,
        });
        const created = await this.accountAddOnsRepository.save(newAddOn);
        results.push(created);
      }
    }

    // Deactivate add-ons that are no longer in the list
    const processedIds = addOnsList
      .filter(addon => addon.id) // Only existing records have IDs
      .map(addon => addon.id);
    
    const addOnsToDeactivate = existingAddOns.filter(existing => 
      !processedIds.includes(existing.id) && 
      !addOnsList.some(newAddOn => !newAddOn.id && newAddOn.add_ons_type === existing.add_ons_type)
    );

    console.log(`🗑️ Deactivating ${addOnsToDeactivate.length} add-ons that are no longer in the list`);
    for (const addOnToDeactivate of addOnsToDeactivate) {
      console.log(`🗑️ Deactivating add-on ID: ${addOnToDeactivate.id}, type: ${addOnToDeactivate.add_ons_type}`);
      addOnToDeactivate.is_active = false;
      addOnToDeactivate.updated_by = username;
      await this.accountAddOnsRepository.save(addOnToDeactivate);
    }

    return results;
  }

  async findByType(accountId: string, addOnsType: 'system_integration' | 'infrastructure'): Promise<AccountAddOns[]> {
    return await this.accountAddOnsRepository.find({
      where: { 
        account_id: accountId,
        add_ons_type: addOnsType,
        is_active: true 
      },
      order: { created_at: 'ASC' },
    });
  }

  async findByBillingType(accountId: string, billingType: 'otc' | 'monthly'): Promise<AccountAddOns[]> {
    return await this.accountAddOnsRepository.find({
      where: { 
        account_id: accountId,
        billing_type: billingType,
        is_active: true 
      },
      order: { created_at: 'ASC' },
    });
  }
}
