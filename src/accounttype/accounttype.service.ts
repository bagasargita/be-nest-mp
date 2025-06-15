import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountType } from './entities/accounttype.entity';
import { CreateAccountTypeDto } from './dto/create-accounttype.dto';
import { UpdateAccountTypeDto } from './dto/update-accounttype.dto';

@Injectable()
export class AccountTypeService {
  constructor(
    @InjectRepository(AccountType)
    private readonly repo: Repository<AccountType>,
  ) {}
  
  async findAll(): Promise<AccountType[]> {
    try {
      return this.repo.find();
    } catch (error) {
      throw new Error('Failed to fetch account types: ' + error.message);
    }
  }

  async findOne(id: string): Promise<AccountType | null> {
    const accountType = await this.repo.findOne({ where: { id } });
    if (!accountType) {
      throw new Error(`AccountType with id ${id} not found`);
    }
    return accountType;
  }

  async create(dto: CreateAccountTypeDto, username: string): Promise<AccountType> {
    const entity = this.repo.create({
      ...dto,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateAccountTypeDto, username: string): Promise<AccountType> {
    const accountType = await this.repo.preload({
      id: id,
      ...dto,
      updated_by: username,
      updated_at: new Date(),
    });
    if (!accountType) {
      throw new Error(`AccountType with id ${id} not found`);
    }
    return this.repo.save(accountType);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ id });
    if (result.affected === 0) {
      throw new Error(`Account Type with id ${id} not found`);
    }
  }
}