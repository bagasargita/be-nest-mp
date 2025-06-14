import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './entities/bank.entity';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private readonly repo: Repository<Bank>,
  ) {}

  findAll(): Promise<Bank[]> {
    return this.repo.find();
  }

  findOne(id: string): Promise<Bank | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(dto: CreateBankDto): Promise<Bank> {
    const entity = this.repo.create({
      ...dto,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateBankDto): Promise<Bank> {
    await this.repo.update(id, {
      ...dto,
      updated_at: new Date(),
    });
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`Bank with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}