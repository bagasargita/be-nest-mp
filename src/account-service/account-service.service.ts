import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from './entities/account-service.entity';
import { CreateAccountServiceDto } from './dto/create-account-service.dto';
import { UpdateAccountServiceDto } from './dto/update-account-service.dto';

@Injectable()
export class AccountServiceService {
  constructor(
    @InjectRepository(AccountService)
    private readonly repo: Repository<AccountService>,
  ) {}

  async findByAccountId(accountId: string): Promise<AccountService[]> {
    return this.repo.find({
      where: { account: { id: accountId } },
      relations: ['account', 'service'],
    });
  }

  async findAll(): Promise<AccountService[]> {
    return this.repo.find({
      relations: ['account', 'service'],
    });
  }

  async findByServiceIdAndAccountId(serviceId: string, accountId: string): Promise<AccountService[]> {
    return this.repo.find({
      where: { account: { id: accountId }, service: { id: serviceId } },
      relations: ['account', 'service'],
    });
  }

  async findOne(id: string): Promise<AccountService | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['account', 'service'],
    });
  }

  async findByAccountIdWithRelations(accountId: string)  {
    const result = await this.repo.find({
      where: { account: { id: accountId } },
      relations: ['service']
    });
    
    return {
      success: true,
      data: result,
      message: "Successfully retrieved account services"
    };
  }

  async create(createAccountServiceDto: CreateAccountServiceDto, username: string): Promise<AccountService> { 
    const entity = this.repo.create({
      account: { id: createAccountServiceDto.account_id },
      service: { id: createAccountServiceDto.service_id },
      is_active: createAccountServiceDto.is_active ?? true,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, updateAccountServiceDto: UpdateAccountServiceDto, username: string): Promise<AccountService> {
    const updateData: any = {
      updated_by: username,
      updated_at: new Date(),
    };
    if (updateAccountServiceDto.account_id) updateData.account = { id: updateAccountServiceDto.account_id };
    if (updateAccountServiceDto.service_id) updateData.service = { id: updateAccountServiceDto.service_id };
    if (updateAccountServiceDto.is_active !== undefined) updateData.is_active = updateAccountServiceDto.is_active;

    const accountService = await this.repo.preload({
      id: id,
      ...updateData,
    });
    if (!accountService) {
      throw new Error(`AccountService with ID ${id} not found`);
    }
    return this.repo.save(accountService);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ id });
    if (result.affected === 0) {
      throw new Error(`AccountService with ID ${id} not found`);
    }
  }

  async findByAccountServiceId(accountServiceId: string): Promise<AccountService | null> {
    return this.repo.findOne({
      where: { id: accountServiceId },
      relations: ['account', 'service'],
    });
  }
}
