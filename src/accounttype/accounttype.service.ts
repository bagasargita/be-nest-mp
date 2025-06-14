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
  
  findAll(): Promise<AccountType[]> {
    return this.repo.find();
  }

  findOne(id: string): Promise<AccountType | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(dto: CreateAccountTypeDto): Promise<AccountType> {
    const entity = this.repo.create({
      ...dto,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

    async update(id: string, dto: UpdateAccountTypeDto): Promise<AccountType> {
      await this.repo.update(id, {
        ...dto,
        updated_at: new Date(),
      });
      const updated = await this.findOne(id);
      if (!updated) {
        throw new Error('AccountType not found');
      }
      return updated;
    }
  
    async remove(id: string): Promise<void> {
      await this.repo.delete(id);
    }
  }