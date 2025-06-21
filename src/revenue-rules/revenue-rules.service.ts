import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, TreeRepository } from 'typeorm';
import { RevenueRule } from './revenue-rules.entity';
import { CreateRevenueRuleDto } from './dto/create-revenue-rules.dto';
import { UpdateRevenueRuleDto } from './dto/update-revenue-rules.dto';

@Injectable()
export class RevenueRuleService {
  private revenueRuleRepository: TreeRepository<RevenueRule>;

  constructor(
    private dataSource: DataSource,
  ) {
    this.revenueRuleRepository = this.dataSource.getTreeRepository(RevenueRule);
  }

  async create(createRevenueRuleDto: CreateRevenueRuleDto): Promise<RevenueRule> {
    const { parentId, ...revenueRuleData } = createRevenueRuleDto;
    const revenueRule = this.revenueRuleRepository.create(revenueRuleData);

    if (parentId) {
      const parent = await this.revenueRuleRepository.findOne({ where: { id: parentId } });
      if (!parent) {
        throw new NotFoundException(`Parent revenue rule with ID ${parentId} not found`);
      }
      revenueRule.parent = parent;
    }

    return this.revenueRuleRepository.save(revenueRule);
  }

  async findAll(): Promise<RevenueRule[]> {
    return this.revenueRuleRepository.findTrees();
  }

  async findOne(id: string): Promise<RevenueRule> {
    const revenueRule = await this.revenueRuleRepository.findOne({ 
      where: { id: parseInt(id, 10) },
      relations: ['parent', 'children']
    });
    
    if (!revenueRule) {
      throw new NotFoundException(`Revenue rule with ID ${id} not found`);
    }
    return revenueRule;
  }

  async update(id: string, updateRevenueRuleDto: UpdateRevenueRuleDto): Promise<RevenueRule> {
    const revenueRule = await this.findOne(id);
    const { parentId, ...updateData } = updateRevenueRuleDto;

    // Update the revenue rule data
    Object.assign(revenueRule, updateData);

    // Handle parent relationship
    if (parentId !== undefined) {
      if (parentId === null) {
        revenueRule.parent = null;
      } else {
        const parent = await this.revenueRuleRepository.findOne({ where: { id: parentId } });
        if (!parent) {
          throw new NotFoundException(`Parent revenue rule with ID ${parentId} not found`);
        }
        // Check for circular reference
        if (parent.id === parseInt(id, 10)) {
          throw new Error('Cannot set parent to self');
        }
        revenueRule.parent = parent;
      }
    }

    return this.revenueRuleRepository.save(revenueRule);
  }

  async remove(id: string): Promise<void> {
    const revenueRule = await this.findOne(id);
    await this.revenueRuleRepository.remove(revenueRule);
  }
} 