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
    // First, deactivate existing tiers for this account
    await this.removeByAccountId(accountId);

    // Create new tiers
    const results: AccountPackageTier[] = [];
    for (const tierData of tiers) {
      const tier = await this.create({ ...tierData, account_id: accountId }, username);
      results.push(tier);
    }

    return results;
  }
}
