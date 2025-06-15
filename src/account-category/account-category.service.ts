import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountCategory } from './entities/account-category.entity';
import { CreateAccountCategoryDto } from './dto/create-account-category.dto';
import { UpdateAccountCategoryDto } from './dto/update-account-category.dto';

@Injectable()
export class AccountCategoryService {
  constructor(
    @InjectRepository(AccountCategory)
    private readonly repo: Repository<AccountCategory>,
  ) {}

  async findAll(): Promise<AccountCategory[]> {
    try {
      return this.repo.find();
    } catch (error) {
      throw new Error('Failed to fetch account categories: ' + error.message);
    }
  }

  async findOne(id: string): Promise<AccountCategory | null> {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`AccountCategory with id ${id} not found`);
    }
    return category;
  }

  async create(dto: CreateAccountCategoryDto, username: string): Promise<AccountCategory> {
    const newAccountCategory = this.repo.create({
      ...dto,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(newAccountCategory);
  }

  async update(id: string, dto: UpdateAccountCategoryDto, username: string): Promise<AccountCategory> {
    const accountCategory = await this.repo.preload({
      id: id,
      ...dto,
      updated_by: username,
      updated_at: new Date(),
    });
    if (!accountCategory) {
      throw new NotFoundException(`AccountCategory with id ${id} not found`);
    }
    
    return this.repo.save(accountCategory);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`AccountCategory with id ${id} not found`);
    }
  }
}