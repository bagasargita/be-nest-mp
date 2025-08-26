import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountAddress } from './entities/account-address.entity';
import { CreateAccountAddressDto } from './dto/create-account-address.dto';
import { UpdateAccountAddressDto } from './dto/update-account-address.dto';

@Injectable()
export class AccountAddressService {
  constructor(
    @InjectRepository(AccountAddress)
    private readonly repo: Repository<AccountAddress>,
  ) {}

  async findByAccountId(accountId: string): Promise<AccountAddress[]> {
    return this.repo.find({ 
      where: { account: { id: accountId } }
    });
  }
  
  async findAll(): Promise<AccountAddress[]> {
    return this.repo.find({ relations: ['account'] });
  }

  async findOne(id: string): Promise<AccountAddress | null> {
    return this.repo.findOne({ where: { id }, relations: ['account'] });
  }

  async create(dto: CreateAccountAddressDto, username: string): Promise<AccountAddress> {
    const entity = this.repo.create({
      ...dto,
      account: { id: dto.account_id } as any,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateAccountAddressDto, username: string): Promise<AccountAddress> {
    const updateData: any = {
      ...dto,
      updated_by: username,
      updated_at: new Date(),
    };
    if (dto.account_id) updateData.account = { id: dto.account_id };

    const accountAddress = await this.repo.preload({
      id: id,
      ...updateData,
    });
    if (!accountAddress) {
      throw new Error(`AccountAddress with id ${id} not found`);
    }
    return this.repo.save(accountAddress);
  }

  async remove(id: string, username: string): Promise<void> {
    const accountAddress = await this.repo.findOne({ where: { id } });
    if (!accountAddress) {
      throw new Error(`Account Address with id ${id} not found`);
    }
    accountAddress.is_active = false;
    accountAddress.updated_by = username;
    accountAddress.updated_at = new Date();
    await this.repo.save(accountAddress);
  }
}