import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
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
    private readonly accountAddressService: AccountAddressService,
    private readonly accountPICService: AccountPICService,
    private readonly accountBankService: AccountBankService,
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
          this.accountPICService.findByAccountIdWithRelations(account.id), // gunakan relasi position
          this.accountBankService.findByAccountIdWithRelations(account.id) // gunakan relasi bank & bank_category
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

  async generateAccountNo(accountTypeName: string, parentId?: string): Promise<{ account_no: string }> {
    const padSeq = (seq: number, len = 3) => String(seq).padStart(len, '0');
    const padSeq4 = (seq: number) => String(seq).padStart(4, '0');
    const today = new Date();
    const YY = String(today.getFullYear()).slice(-2);
    const MM = String(today.getMonth() + 1).padStart(2, '0');
    const DD = String(today.getDate()).padStart(2, '0');

    let accountNo = '';
    let sequence = 1;

    if (accountTypeName === 'parent') {
      // Format: YYMMDD-0001
      const prefix = `${YY}${MM}${DD}`;
      const count = await this.repo.createQueryBuilder("account")
        .where("account.account_no LIKE :prefix", { prefix: `${prefix}-%` })
        .andWhere("account.parentId IS NULL")
        .getCount();
      sequence = count + 1;
      accountNo = `${prefix}-${padSeq4(sequence)}`;
    } else if (['child', 'branch', 'sub-branch'].includes(accountTypeName)) {
      if (!parentId) throw new BadRequestException('parent_id is required');
      // Cari parent
      const parent = await this.repo.findOne({ where: { id: parentId } });
      if (!parent) throw new BadRequestException('Parent not found');
      // Hitung jumlah anak langsung parent ini
      const count = await this.repo.count({ where: { parent: { id: parentId } } });
      sequence = count + 1;
      accountNo = `${parent.account_no}-${padSeq(sequence)}`;
    } else {
      throw new BadRequestException('Invalid account_type_name');
    }

    return { account_no: accountNo };
  }

  async findOne(id: string): Promise<any> {
    const account = await this.repo.findOne({
      where: { id },
      relations: [
        'industry',
        'type_of_business',
        'account_type',
        'account_category',
        'parent'
      ]
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    // Ambil data terkait dengan relasi lengkap
    const [addresses, pics, banks] = await Promise.all([
      this.accountAddressService.findByAccountId(id),
      this.accountPICService.findByAccountIdWithRelations(id), // relasi position
      this.accountBankService.findByAccountIdWithRelations(id) // relasi bank & bank_category
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
    if (!account) {
      throw new Error(`Account with id ${id} not found`);
    }
    return this.repo.save(account);
  }

  async remove(id: string): Promise<void> {
    const account = await this.repo.delete({ id });
    if (!account) {
      throw new Error(`Account with id ${id} not found`);
    }
  }

  async findDescendants(id: string) {
    return this.repo.findDescendantsTree({ id } as Account);
  }

  async getParentAccountTree(): Promise<Account[]> {
    return this.repo.findTrees();
  }
}