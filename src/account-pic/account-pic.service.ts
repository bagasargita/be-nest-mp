import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountPIC } from './entities/account-pic.entity';
import { CreateAccountPICDto } from './dto/create-account-pic.dto';
import { UpdateAccountPICDto } from './dto/update-account-pic.dto';

@Injectable()
export class AccountPICService {
  constructor(
    @InjectRepository(AccountPIC)
    private readonly repo: Repository<AccountPIC>,
  ) {}

  async findByAccountId(accountId: string): Promise<AccountPIC[]> {
    return this.repo.find({ 
      where: { account: { id: accountId } }
    });
  }
  
  async findAll(): Promise<AccountPIC[]> {
    try {
      return this.repo.find({ relations: ['account', 'position'] });
    } catch (error) {
      throw new Error('Failed to fetch account PICs: ' + error.message);
    }
  }

  async findOne(id: string): Promise<AccountPIC | null> {
    const accountPIC = await this.repo.findOne({ where: { id }, relations: ['account', 'position'] });
    if (!accountPIC) {
      throw new Error(`AccountPIC with id ${id} not found`);
    }
    return accountPIC;
  }

  async findByAccountIdWithRelations(accountId: string) {
    return this.repo.find({
      where: { account: { id: accountId } },
      relations: ['position']
    });
  }

  async create(dto: CreateAccountPICDto, username: string): Promise<AccountPIC> {
    const entity = this.repo.create({
      ...dto,
      account: { id: dto.account_id } as any,
      position: dto.position_id ? { id: dto.position_id } : undefined,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateAccountPICDto, username: string): Promise<AccountPIC> {
    const updateData: any = {
      ...dto,
      updated_by: username,
      updated_at: new Date(),
    };
    if (dto.account_id) updateData.account = { id: dto.account_id };
    if (dto.position_id) updateData.position = { id: dto.position_id };
    
    const accountPIC = await this.repo.preload({
      id: id,
      ...updateData,
    });
    if (!accountPIC) {
      throw new Error(`AccountPIC with id ${id} not found`);
    }
    return this.repo.save(accountPIC);
    // Uncomment the following lines if you want to use a different approach
    // await this.repo.update(id, updateData);
    // const updated = await this.findOne(id);
    // if (!updated) {
    //   throw new Error(`AccountPIC with id ${id} not found`);
    // }
    // return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ id });
    if (result.affected === 0) {
      throw new Error(`AccountPIC with id ${id} not found`);
    }
  }
}