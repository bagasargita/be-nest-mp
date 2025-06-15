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
    // Uncomment the following lines if you want to use a different approach
    // await this.repo.update(id, updateData);
    // const updated = await this.findOne(id);
    // if (!updated) {
    //   throw new Error(`AccountAddress with id ${id} not found`);
    // }
    // return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ id });
    if (result.affected === 0) {
      throw new Error(`Account Address with id ${id} not found`);
    }
  }
}