import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountPackageTier } from './entities/account-package-tier.entity';
import { CreateAccountPackageTierDto, UpdateAccountPackageTierDto } from './dto/account-package-tier.dto';

@Injectable()
export class AccountPackageTierService {
  constructor(
    @InjectRepository(AccountPackageTier)
    private accountPackageTierRepository: Repository<AccountPackageTier>,
  ) {}

  async create(createDto: CreateAccountPackageTierDto, username: string): Promise<AccountPackageTier> {
    // Validate that min_value < max_value
    if (createDto.min_value >= createDto.max_value) {
      throw new BadRequestException('Min value must be less than max value');
    }

    // Validate date range
    const startDate = new Date(createDto.start_date);
    const endDate = new Date(createDto.end_date);
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Check for overlapping ranges for the same account
    const overlapping = await this.accountPackageTierRepository
      .createQueryBuilder('tier')
      .where('tier.account_id = :accountId', { accountId: createDto.account_id })
      .andWhere('tier.is_active = :isActive', { isActive: true })
      .andWhere(
        '(tier.min_value <= :maxValue AND tier.max_value >= :minValue) AND ' +
        '(tier.start_date <= :endDate AND tier.end_date >= :startDate)',
        {
          minValue: createDto.min_value,
          maxValue: createDto.max_value,
          startDate: createDto.start_date,
          endDate: createDto.end_date,
        }
      )
      .getOne();

    if (overlapping) {
      throw new BadRequestException('Package tier range overlaps with existing tier');
    }

    const packageTier = this.accountPackageTierRepository.create({
      ...createDto,
      start_date: startDate,
      end_date: endDate,
      created_by: username,
      is_active: true,
    });

    return await this.accountPackageTierRepository.save(packageTier);
  }

  async findByAccountId(accountId: string): Promise<AccountPackageTier[]> {
    return await this.accountPackageTierRepository.find({
      where: { 
        account_id: accountId,
        is_active: true 
      },
      order: { min_value: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AccountPackageTier> {
    const packageTier = await this.accountPackageTierRepository.findOne({
      where: { id, is_active: true },
    });

    if (!packageTier) {
      throw new NotFoundException('Package tier not found');
    }

    return packageTier;
  }

  async update(id: string, updateDto: UpdateAccountPackageTierDto, username: string): Promise<AccountPackageTier> {
    const packageTier = await this.findOne(id);

    // Validate min/max values if provided
    const minValue = updateDto.min_value ?? packageTier.min_value;
    const maxValue = updateDto.max_value ?? packageTier.max_value;
    
    if (minValue >= maxValue) {
      throw new BadRequestException('Min value must be less than max value');
    }

    // Validate date range if provided
    let startDate = packageTier.start_date;
    let endDate = packageTier.end_date;

    if (updateDto.start_date) {
      startDate = new Date(updateDto.start_date);
    }
    if (updateDto.end_date) {
      endDate = new Date(updateDto.end_date);
    }

    // Ensure dates are Date objects
    if (!(startDate instanceof Date)) {
      startDate = new Date(startDate);
    }
    if (!(endDate instanceof Date)) {
      endDate = new Date(endDate);
    }

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Check for overlapping ranges (excluding current tier)
    const overlapping = await this.accountPackageTierRepository
      .createQueryBuilder('tier')
      .where('tier.account_id = :accountId', { accountId: packageTier.account_id })
      .andWhere('tier.id != :currentId', { currentId: id })
      .andWhere('tier.is_active = :isActive', { isActive: true })
      .andWhere(
        '(tier.min_value <= :maxValue AND tier.max_value >= :minValue) AND ' +
        '(tier.start_date <= :endDate AND tier.end_date >= :startDate)',
        {
          minValue,
          maxValue,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        }
      )
      .getOne();

    if (overlapping) {
      throw new BadRequestException('Package tier range overlaps with existing tier');
    }

    // Update fields
    Object.assign(packageTier, {
      ...updateDto,
      start_date: startDate,
      end_date: endDate,
      updated_by: username,
    });

    return await this.accountPackageTierRepository.save(packageTier);
  }

  async remove(id: string): Promise<void> {
    const packageTier = await this.findOne(id);
    packageTier.is_active = false;
    await this.accountPackageTierRepository.save(packageTier);
  }

  async removeByAccountId(accountId: string): Promise<void> {
    await this.accountPackageTierRepository.update(
      { account_id: accountId, is_active: true },
      { is_active: false }
    );
  }

  async createBulk(accountId: string, tiers: Array<Omit<CreateAccountPackageTierDto, 'account_id'>>, username: string): Promise<AccountPackageTier[]> {
    console.log(`🔄 Processing ${tiers.length} package tiers for account ${accountId}`);
    
    // Get existing package tiers for this account
    const existingTiers = await this.accountPackageTierRepository.find({
      where: { account_id: accountId, is_active: true }
    });

    const results: AccountPackageTier[] = [];

    // Process each tier
    for (const tierData of tiers) {
      let existingTier: AccountPackageTier | undefined;

      // First try to find by ID if provided
      if (tierData.id) {
        existingTier = existingTiers.find(existing => existing.id === tierData.id);
        console.log(`🔍 Looking for tier by ID ${tierData.id}: ${existingTier ? 'Found' : 'Not found'}`);
      }

      // If not found by ID, fall back to range-based matching for backward compatibility
      if (!existingTier) {
        existingTier = existingTiers.find(existing => 
          Math.abs(existing.min_value - tierData.min_value) < 0.01 && 
          Math.abs(existing.max_value - tierData.max_value) < 0.01 &&
          new Date(existing.start_date).toDateString() === new Date(tierData.start_date).toDateString() &&
          new Date(existing.end_date).toDateString() === new Date(tierData.end_date).toDateString()
        );
        if (existingTier) {
          console.log(`🔍 Found tier by range matching: ID ${existingTier.id}`);
        }
      }

      if (existingTier) {
        // Update existing tier
        console.log(`📝 Updating existing tier ID: ${existingTier.id}`);
        Object.assign(existingTier, {
          ...tierData,
          start_date: new Date(tierData.start_date),
          end_date: new Date(tierData.end_date),
          updated_by: username,
        });
        const updated = await this.accountPackageTierRepository.save(existingTier);
        results.push(updated);
      } else {
        // Create new tier
        console.log(`➕ Creating new tier with min: ${tierData.min_value}, max: ${tierData.max_value}`);
        const startDate = new Date(tierData.start_date);
        const endDate = new Date(tierData.end_date);
        
        const newTier = this.accountPackageTierRepository.create({
          ...tierData,
          account_id: accountId,
          start_date: startDate,
          end_date: endDate,
          created_by: username,
          is_active: true,
        });
        const created = await this.accountPackageTierRepository.save(newTier);
        results.push(created);
      }
    }

    // Deactivate tiers that are no longer in the list
    const processedIds = tiers
      .filter(tier => tier.id) // Only existing records have IDs
      .map(tier => tier.id);
    
    const tiersToDeactivate = existingTiers.filter(existing => 
      !processedIds.includes(existing.id) && 
      !tiers.some(newTier => !newTier.id && 
        Math.abs(existing.min_value - newTier.min_value) < 0.01 && 
        Math.abs(existing.max_value - newTier.max_value) < 0.01 &&
        existing.start_date.toDateString() === new Date(newTier.start_date).toDateString() &&
        existing.end_date.toDateString() === new Date(newTier.end_date).toDateString()
      )
    );

    console.log(`🗑️ Deactivating ${tiersToDeactivate.length} tiers that are no longer in the list`);
    for (const tierToDeactivate of tiersToDeactivate) {
      console.log(`🗑️ Deactivating tier ID: ${tierToDeactivate.id}, range: ${tierToDeactivate.min_value}-${tierToDeactivate.max_value}`);
      tierToDeactivate.is_active = false;
      tierToDeactivate.updated_by = username;
      await this.accountPackageTierRepository.save(tierToDeactivate);
    }

    return results;
  }
}
