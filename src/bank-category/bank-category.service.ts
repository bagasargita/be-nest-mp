import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankCategory } from './entities/bank-category.entity';
import { CreateBankCategoryDto } from './dto/create-bank-category.dto';
import { UpdateBankCategoryDto } from './dto/update-bank-category.dto';

@Injectable()
export class BankCategoryService {
  constructor(
    @InjectRepository(BankCategory)
    private readonly repo: Repository<BankCategory>,
  ) {}

  async findAll(): Promise<BankCategory[]> {
    try {
      return this.repo.find();
    } catch (error) {
      throw new Error('Failed to fetch bank categories: ' + error.message);
    }
  }

  async findOne(id: string): Promise<BankCategory | null> {
    const bankCategory = await this.repo.findOne({ where: { id } });
    if (!bankCategory) {
      throw new Error(`BankCategory with id ${id} not found`);
    }
    return bankCategory
  }

  async create(dto: CreateBankCategoryDto, username: string): Promise<BankCategory> {
    const entity = this.repo.create({
      ...dto,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateBankCategoryDto, username: string): Promise<BankCategory> {
    const bankCategory = await this.repo.preload({
      id: id,
      ...dto,
      updated_by: username,
      updated_at: new Date(),
    });
    if (!bankCategory) {
      throw new Error(`BankCategory with id ${id} not found`);
    }
    return this.repo.save(bankCategory);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ id });
    if (result.affected === 0) {
      throw new Error(`BankCategory with id ${id} not found`);
    }
  }
}