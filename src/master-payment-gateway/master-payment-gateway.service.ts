
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterPaymentGateway } from './entities/master-payment-gateway.entity';
import { CreateMasterPaymentGatewayDto } from './dto/create-master-payment-gateway.dto';
import { UpdateMasterPaymentGatewayDto } from './dto/update-master-payment-gateway.dto';

@Injectable()
export class MasterPaymentGatewayService {
  constructor(
    @InjectRepository(MasterPaymentGateway)
    private readonly repo: Repository<MasterPaymentGateway>,
  ) {}

  async findAll(): Promise<MasterPaymentGateway[]> {
    try {
      return this.repo.find();
    } catch (error) {
      throw new Error('Failed to fetch payment gateways: ' + error.message);
    }
  }

  async findOne(id: string): Promise<MasterPaymentGateway | null> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new Error(`MasterPaymentGateway with id ${id} not found`);
    }
    return entity;
  }

  async create(dto: CreateMasterPaymentGatewayDto, username: string): Promise<MasterPaymentGateway> {
    const entity = this.repo.create({
      ...dto,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateMasterPaymentGatewayDto, username: string): Promise<MasterPaymentGateway> {
    const entity = await this.repo.preload({
      id: id,
      ...dto,
      updated_by: username,
      updated_at: new Date(),
    });
    if (!entity) {
      throw new Error(`MasterPaymentGateway with id ${id} not found`);
    }
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ id });
    if (result.affected === 0) {
      throw new Error(`MasterPaymentGateway with id ${id} not found`);
    }
  }
}
