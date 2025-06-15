import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Industry } from './entities/industry.entity';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';

@Injectable()
export class IndustryService {
  constructor(
    @InjectRepository(Industry)
    private readonly repo: Repository<Industry>,
  ) {}

  async findAll(): Promise<Industry[]> {
    try {
      return this.repo.find();
    } catch (error) {
      throw new Error('Failed to fetch industries: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Industry | null> {
    const industry = await this.repo.findOne({ where: { id } });
    if (!industry) {
      throw new Error(`Industry with id ${id} not found`);
    }
    return industry;
  }

  async create(dto: CreateIndustryDto, username: string): Promise<Industry> {
    const entity = this.repo.create({
      ...dto,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateIndustryDto, username: string): Promise<Industry> {
    const industry = await this.repo.preload({
      id: id,
      ...dto,
      updated_by: username,
      updated_at: new Date(),
    });
    if (!industry) {
      throw new Error(`Industry with id ${id} not found`);
    }
    return this.repo.save(industry);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ id });
    if (result.affected === 0) {  
      throw new Error(`Industry with id ${id} not found`);
    }
  }
}