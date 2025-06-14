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

  findAll(): Promise<TypeOfBusiness[]> {
    return this.repo.find();
  }

  findOne(id: string): Promise<TypeOfBusiness | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(dto: CreateTypeOfBusinessDto): Promise<TypeOfBusiness> {
    const entity = this.repo.create({
      ...dto,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateTypeOfBusinessDto): Promise<TypeOfBusiness> {
    await this.repo.update(id, {
      ...dto,
      updated_at: new Date(),
    });
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`TypeOfBusiness with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}