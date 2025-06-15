import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOfBusiness } from './entities/type-of-business.entity';
import { CreateTypeOfBusinessDto } from './dto/create-type-of-business.dto';
import { UpdateTypeOfBusinessDto } from './dto/update-type-of-business.dto';

@Injectable()
export class TypeOfBusinessService {
  constructor(
    @InjectRepository(TypeOfBusiness)
    private readonly repo: Repository<TypeOfBusiness>,
  ) {}

  async findAll(): Promise<TypeOfBusiness[]> {
    try {
      return this.repo.find();
    } catch (error) {
      throw new Error('Failed to fetch types of business: ' + error.message);
    }
  }

  async findOne(id: string): Promise<TypeOfBusiness | null> {
    const typeOfBusiness = await this.repo.findOne({ where: { id } });
    if (!typeOfBusiness) {
      throw new Error(`TypeOfBusiness with id ${id} not found`);
    }
    return typeOfBusiness;
  }

  async create(dto: CreateTypeOfBusinessDto, username: string): Promise<TypeOfBusiness> {
    const entity = this.repo.create({
      ...dto,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateTypeOfBusinessDto, username: string): Promise<TypeOfBusiness> {
    const typeOfBusiness = await this.repo.preload({
      id: id,
      ...dto,
      updated_by: username,
      updated_at: new Date(),
    });
    if (!typeOfBusiness) {
      throw new Error(`TypeOfBusiness with id ${id} not found`);
    }
    return this.repo.save(typeOfBusiness);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ id });
    if (result.affected === 0) {
      throw new Error(`TypeOfBusiness with id ${id} not found`);
    }
  }
}