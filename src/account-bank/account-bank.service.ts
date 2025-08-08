import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountBank } from './entities/account-bank.entity';
import { CreateAccountBankDto } from './dto/create-account-bank.dto';
import { UpdateAccountBankDto } from './dto/update-account-bank.dto';

@Injectable()
export class AccountBankService {
  constructor(
    @InjectRepository(AccountBank)
    private readonly repo: Repository<AccountBank>,
  ) {}

  async findByAccountId(accountId: string): Promise<AccountBank[]> {
    return this.repo.find({ 
      where: { account: { id: accountId } }
    });
  }

  async findAll(): Promise<AccountBank[]> {
    return this.repo.find({ relations: ['account', 'bank', 'bank_category'] });
  }

  async findOne(id: string): Promise<AccountBank | null> {
    return this.repo.findOne({ where: { id }, relations: ['account', 'bank', 'bank_category'] });
  }

  async findByAccountIdWithRelations(accountId: string) {
    return this.repo.find({
      where: { account: { id: accountId } },
      relations: ['bank', 'bank_category']
    });
  }

  async create(dto: CreateAccountBankDto, username: string): Promise<AccountBank> {
    const entity = this.repo.create({
      ...dto,
      account: { id: dto.account_id } as any,
      bank: { id: dto.bank_id } as any,
      bank_category: dto.bank_category_id ? { id: dto.bank_category_id } : undefined,
      bank_account_holder_name: `${dto.bank_account_holder_firstname} ${dto.bank_account_holder_lastname}`,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateAccountBankDto, username: string): Promise<AccountBank> {
    const updateData: any = {
      ...dto,
      bank_account_holder_name: `${dto.bank_account_holder_firstname} ${dto.bank_account_holder_lastname}`,
      updated_by: username,
      updated_at: new Date(),
    };
    if (dto.account_id) updateData.account = { id: dto.account_id };
    if (dto.bank_id) updateData.bank = { id: dto.bank_id };
    if (dto.bank_category_id) updateData.bank_category = { id: dto.bank_category_id };
    
    const accountBank = await this.repo.preload({
      id: id,
      ...updateData,
    });
    if (!accountBank) {
      throw new Error(`AccountBank with id ${id} not found`);
    }
    return this.repo.save(accountBank);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ id });
    if (result.affected === 0) {
      throw new Error(`Account Bank with id ${id} not found`);
    }
  }
}