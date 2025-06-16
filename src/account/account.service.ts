import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository, In } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountAddressService } from '../account-address/account-address.service';
import { AccountPICService } from '../account-pic/account-pic.service';
import { AccountBankService } from '../account-bank/account-bank.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly repo: TreeRepository<Account>,
    private readonly accountAddressService: AccountAddressService, // Assuming you have an AccountAddressService for address management
    private readonly accountPICService: AccountPICService, // Assuming you have an AccountPICService for PIC management
    private readonly accountBankService: AccountBankService, // Assuming you have an AccountBankService for bank management
  ) {}

  async findAll(): Promise<Account[]> {
    const accounts = await this.repo.findTrees({
      relations: [
        'industry',
        'type_of_business',
        'account_type',
        'account_category'
      ]
    });

    // Populate addresses, PICs, and banks for each account
    const accountsWithRelations = await Promise.all(
      accounts.map(async (account) => {
        const [addresses, pics, banks] = await Promise.all([
          this.accountAddressService.findByAccountId(account.id),
          this.accountPICService.findByAccountId(account.id),
          this.accountBankService.findByAccountId(account.id)
        ]);
        
        return {
          ...account,
          account_address: addresses || [],
          account_pic: pics || [],
          account_bank: banks || []
        };
      }),
    );
    return accountsWithRelations;
  }

  async findOne(id: string): Promise<any> {
    const account = await this.repo.findOne({ 
      where: { id },
      relations: [
        'industry',
        'type_of_business',
        'account_type',
        'account_category',
        'parent' // Jika ingin mengambil parent account
      ] 
    });
    
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    // Ambil data terkait
    const [addresses, pics, banks] = await Promise.all([
      this.accountAddressService.findByAccountId(id),
      this.accountPICService.findByAccountId(id),
      this.accountBankService.findByAccountId(id)
    ]);
    
    return {
      ...account,
      account_address: addresses || [],
      account_pic: pics || [],
      account_bank: banks || []
    };
  }

  async create(dto: CreateAccountDto, username: string): Promise<Account> {
    const entity = this.repo.create({
      ...dto,
      industry: dto.industry_id ? { id: dto.industry_id } : undefined,
      type_of_business: dto.type_of_business_id ? { id: dto.type_of_business_id } : undefined,
      account_type: dto.account_type_id ? { id: dto.account_type_id } : undefined,
      account_category: dto.account_category_id ? { id: dto.account_category_id } : undefined,
      parent: dto.parent_id ? { id: dto.parent_id } as any : null,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateAccountDto, username: string): Promise<Account> {
    const updateData: any = {
      ...dto,
      updated_by: username,
      updated_at: new Date(),
    };
    if (dto.industry_id) updateData.industry = { id: dto.industry_id };
    if (dto.type_of_business_id) updateData.type_of_business = { id: dto.type_of_business_id };
    if (dto.account_type_id) updateData.account_type = { id: dto.account_type_id };
    if (dto.account_category_id) updateData.account_category = { id: dto.account_category_id };
    if (dto.parent_id) updateData.parent = { id: dto.parent_id } as any;

    const account = await this.repo.preload({
      id: id,
      ...updateData,
    });
    // const updated = await this.findOne(id);
    if (!account) {
      throw new Error(`Account with id ${id} not found`);
    }
    return this.repo.save(account);
  }

  async remove(id: string): Promise<void> {
    const account = await this.repo.delete({ id });
    if (!account) {
      throw new Error(`Account with id ${id} not found`);
    };
  }

  // Contoh: ambil seluruh subtree (descendants) dari sebuah account
  async findDescendants(id: string) {
    return this.repo.findDescendantsTree({ id } as Account);
  }
}