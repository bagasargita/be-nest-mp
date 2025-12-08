import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterMachine } from './entities/master-machine.entity';
import { CreateMasterMachineDto } from './dto/create-master-machine.dto';
import { UpdateMasterMachineDto } from './dto/update-master-machine.dto';

@Injectable()
export class MasterMachineService {
  constructor(
    @InjectRepository(MasterMachine)
    private readonly repo: Repository<MasterMachine>,
  ) {}

  async findAll(): Promise<MasterMachine[]> {
    return this.repo.find({
      where: { is_active: true },
      relations: ['account'],
      order: { created_at: 'DESC' },
    });
  }

  async findByAccountId(accountId: string): Promise<MasterMachine[]> {
    return this.repo.find({
      where: { 
        account_id: accountId,
        is_active: true 
      },
      relations: ['account'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<MasterMachine | null> {
    return this.repo.findOne({ where: { id }, relations: ['account'] });
  }

  async create(dto: CreateMasterMachineDto, username: string): Promise<MasterMachine> {
    const entity = this.repo.create({
      ...dto,
      account: dto.account_id ? { id: dto.account_id } as any : undefined,
      created_by: username,
      created_at: new Date(),
      is_active: dto.is_active !== undefined ? dto.is_active : true,
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateMasterMachineDto, username: string): Promise<MasterMachine> {
    const machine = await this.repo.findOne({ where: { id }, relations: ['account'] });
    
    if (!machine) {
      throw new Error(`MasterMachine with id ${id} not found`);
    }

    const updateData: any = {
      ...dto,
      updated_by: username,
      updated_at: new Date(),
    };

    if (dto.account_id) {
      updateData.account = { id: dto.account_id } as any;
    }
    
    Object.assign(machine, updateData);
    return this.repo.save(machine);
  }

  async remove(id: string, username: string): Promise<void> {
    const machine = await this.repo.findOne({ where: { id } });
    if (!machine) {
      throw new Error(`MasterMachine with id ${id} not found`);
    }
    machine.is_active = false;
    machine.updated_by = username;
    machine.updated_at = new Date();
    await this.repo.save(machine);
  }
}

