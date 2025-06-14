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

  findAll(): Promise<BankCategory[]> {
    return this.repo.find();
  }

  findOne(id: string): Promise<BankCategory | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(dto: CreateBankCategoryDto): Promise<BankCategory> {
    const entity = this.repo.create({
      ...dto,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateBankCategoryDto): Promise<BankCategory> {
    await this.repo.update(id, {
      ...dto,
      updated_at: new Date(),
    });
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`BankCategory with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}