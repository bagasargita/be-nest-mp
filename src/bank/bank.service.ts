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

  async findAll(): Promise<Bank[]> {
    try {
      return this.repo.find();
    } catch (error) {
      throw new Error('Failed to fetch banks: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Bank | null> {
    const bank = await this.repo.findOne({ where: { id } });
    if (!bank) {  
      throw new Error(`Bank with id ${id} not found`);
    }
    return bank;
  }

  async create(dto: CreateBankDto, username: string): Promise<Bank> {
    const entity = this.repo.create({
      ...dto,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateBankDto, username: string): Promise<Bank> {
    const bank = await this.repo.preload({
      id: id,
      ...dto,
      updated_by: username,
      updated_at: new Date(),
    });
    if (!bank) {
      throw new Error(`Bank with id ${id} not found`);
    }
    return this.repo.save(bank);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new Error(`Bank with id ${id} not found`);
    }
  }
}