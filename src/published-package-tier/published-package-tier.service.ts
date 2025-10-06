import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublishedPackageTier } from './entities/published-package-tier.entity';
import { CreatePublishedPackageTierDto, UpdatePublishedPackageTierDto } from './dto/published-package-tier.dto';

@Injectable()
export class PublishedPackageTierService {
  constructor(
    @InjectRepository(PublishedPackageTier)
    private publishedPackageTierRepository: Repository<PublishedPackageTier>,
  ) {}

  async create(createDto: CreatePublishedPackageTierDto, username: string): Promise<PublishedPackageTier> {
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

    // Check for overlapping ranges
    const overlapping = await this.publishedPackageTierRepository
      .createQueryBuilder('tier')
      .where('tier.is_active = :isActive', { isActive: true })
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
      // Format dates properly for error message
      const formatDate = (date) => {
        if (date instanceof Date) {
          return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        }
        return date;
      };

      throw new BadRequestException(
        `Package tier range overlaps with existing tier: ` +
        `Value range [${overlapping.min_value} - ${overlapping.max_value}] ` +
        `overlaps with [${createDto.min_value} - ${createDto.max_value}], ` +
        `Date range [${formatDate(overlapping.start_date)} - ${formatDate(overlapping.end_date)}] ` +
        `overlaps with [${formatDate(createDto.start_date)} - ${formatDate(createDto.end_date)}]`
      );
    }

    const publishedPackageTier = this.publishedPackageTierRepository.create({
      min_value: createDto.min_value,
      max_value: createDto.max_value,
      amount: createDto.amount,
      percentage: createDto.percentage,
      start_date: startDate,
      end_date: endDate,
      created_by: username,
      is_active: true,
    } as any);

    const saved = await this.publishedPackageTierRepository.save(publishedPackageTier);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAll(): Promise<PublishedPackageTier[]> {
    return await this.publishedPackageTierRepository.find({
      where: { is_active: true },
      order: { min_value: 'ASC' },
    });
  }

  async findAllForDebug(): Promise<any[]> {
    // Return all active tiers with readable format for debugging
    const tiers = await this.publishedPackageTierRepository.find({
      where: { is_active: true },
      order: { min_value: 'ASC' },
    });
    
    return tiers.map(tier => ({
      id: tier.id,
      valueRange: `${tier.min_value} - ${tier.max_value}`,
      dateRange: `${tier.start_date} - ${tier.end_date}`,
      amount: tier.amount,
      percentage: tier.percentage,
    }));
  }

  async findOne(id: string): Promise<PublishedPackageTier> {
    const publishedPackageTier = await this.publishedPackageTierRepository.findOne({
      where: { id, is_active: true },
    });

    if (!publishedPackageTier) {
      throw new NotFoundException('Published package tier not found');
    }

    return publishedPackageTier;
  }

  async update(id: string, updateDto: UpdatePublishedPackageTierDto, username: string): Promise<PublishedPackageTier> {
    const publishedPackageTier = await this.findOne(id);

    // Validate min/max values if provided
    const minValue = updateDto.min_value ?? publishedPackageTier.min_value;
    const maxValue = updateDto.max_value ?? publishedPackageTier.max_value;
    
    if (minValue >= maxValue) {
      throw new BadRequestException('Min value must be less than max value');
    }

    // Validate date range if provided
    let startDate = publishedPackageTier.start_date;
    let endDate = publishedPackageTier.end_date;

    if (updateDto.start_date) {
      startDate = new Date(updateDto.start_date);
    }
    if (updateDto.end_date) {
      endDate = new Date(updateDto.end_date);
    }

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Check for overlapping ranges (excluding current record)
    const overlapping = await this.publishedPackageTierRepository
      .createQueryBuilder('tier')
      .where('tier.is_active = :isActive', { isActive: true })
      .andWhere('tier.id != :currentId', { currentId: id })
      .andWhere(
        '(tier.min_value <= :maxValue AND tier.max_value >= :minValue) AND ' +
        '(tier.start_date <= :endDate AND tier.end_date >= :startDate)',
        {
          minValue: minValue,
          maxValue: maxValue,
          startDate: startDate,
          endDate: endDate,
        }
      )
      .getOne();

    if (overlapping) {
      // Format dates properly for error message
      const formatDate = (date) => {
        if (date instanceof Date) {
          return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        }
        return date;
      };

      throw new BadRequestException(
        `Package tier range overlaps with existing tier: ` +
        `Value range [${overlapping.min_value} - ${overlapping.max_value}] ` +
        `overlaps with [${minValue} - ${maxValue}], ` +
        `Date range [${formatDate(overlapping.start_date)} - ${formatDate(overlapping.end_date)}] ` +
        `overlaps with [${formatDate(startDate)} - ${formatDate(endDate)}]`
      );
    }

    // Update fields
    Object.assign(publishedPackageTier, {
      ...updateDto,
      start_date: startDate,
      end_date: endDate,
      updated_by: username,
    });

    return await this.publishedPackageTierRepository.save(publishedPackageTier);
  }

  async remove(id: string): Promise<void> {
    const publishedPackageTier = await this.findOne(id);
    publishedPackageTier.is_active = false;
    await this.publishedPackageTierRepository.save(publishedPackageTier);
  }

  async createBulk(tiers: CreatePublishedPackageTierDto[], username: string): Promise<PublishedPackageTier[]> {
    console.log(`🔄 Processing ${tiers.length} published package tiers`);
    
    const results: PublishedPackageTier[] = [];

    // Process each tier
    for (const tierData of tiers) {
      try {
        console.log(`➕ Creating published tier with min: ${tierData.min_value}, max: ${tierData.max_value}`);
        const created = await this.create(tierData, username);
        results.push(created);
      } catch (error) {
        console.error(`❌ Error creating tier:`, error.message);
        throw error;
      }
    }

    console.log(`✅ Successfully created ${results.length} published package tiers`);
    return results;
  }

  // Upload functionality for bulk creation
  async uploadFromCsv(csvData: string, username: string): Promise<{ success: number; errors: string[] }> {
    console.log('=== CSV Upload Debug ===');
    console.log('CSV Data Length:', csvData.length);
    console.log('Username:', username);
    
    const lines = csvData.split('\n').filter(line => line.trim());
    console.log('Total lines (after filtering empty):', lines.length);
    
    if (lines.length < 2) {
      throw new BadRequestException('CSV file must contain header and at least one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    console.log('Headers:', headers);
    
    const requiredHeaders = ['min_value', 'max_value', 'amount', 'start_date', 'end_date'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new BadRequestException(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    const results: { success: number; errors: string[] } = { success: 0, errors: [] };

    // Helper function to convert date format from MM/DD/YYYY to YYYY-MM-DD
    const convertDateFormat = (dateString: string): string => {
      try {
        console.log('Converting date:', dateString);
        // Handle both MM/DD/YYYY and YYYY-MM-DD formats
        if (dateString.includes('/')) {
          const [month, day, year] = dateString.split('/');
          const converted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          console.log('Converted to:', converted);
          return converted;
        }
        console.log('Date already in correct format:', dateString);
        return dateString; // Already in YYYY-MM-DD format
      } catch (error) {
        console.error('Date conversion error:', error);
        throw new Error(`Invalid date format: ${dateString}. Expected MM/DD/YYYY or YYYY-MM-DD`);
      }
    };

    for (let i = 1; i < lines.length; i++) {
      try {
        console.log(`Processing row ${i}:`, lines[i]);
        const values = lines[i].split(',').map(v => v.trim());
        console.log('Values:', values);
        
        const startDateStr = values[headers.indexOf('start_date')];
        const endDateStr = values[headers.indexOf('end_date')];
        
        const tierData: CreatePublishedPackageTierDto = {
          min_value: parseFloat(values[headers.indexOf('min_value')]),
          max_value: parseFloat(values[headers.indexOf('max_value')]),
          amount: parseFloat(values[headers.indexOf('amount')]),
          start_date: convertDateFormat(startDateStr),
          end_date: convertDateFormat(endDateStr),
        };

        // Optional percentage - boolean value
        const percentageIndex = headers.indexOf('percentage');
        if (percentageIndex >= 0 && values[percentageIndex] !== '' && values[percentageIndex] !== undefined) {
          const percentageValue = values[percentageIndex].toString().toLowerCase();
          tierData.percentage = percentageValue === 'true' || percentageValue === '1' || percentageValue === 'yes';
        } else {
          // Default to false if not provided
          tierData.percentage = false;
        }

        console.log('Tier data to create:', tierData);
        await this.create(tierData, username);
        results.success++;
        console.log(`Row ${i} processed successfully`);
      } catch (error) {
        console.error(`Error processing row ${i}:`, error);
        results.errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    console.log('Upload results:', results);
    return results;
  }

  async updateUuidBe(id: string, uuidBe: string, username: string): Promise<PublishedPackageTier> {
    const publishedPackageTier = await this.findOne(id);

    // Direct update without business logic validation
    await this.publishedPackageTierRepository.update(id, {
      uuid_be: uuidBe,
      updated_by: username,
      updated_at: new Date(),
    });

    // Return updated entity
    return this.findOne(id);
  }
}
