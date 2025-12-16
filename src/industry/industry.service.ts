import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Industry } from './entities/industry.entity';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';

interface FindAllParams {
  page?: number;
  limit?: number;
  code?: string;
  name?: string;
  description?: string;
  is_active?: boolean;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

@Injectable()
export class IndustryService {
  constructor(
    @InjectRepository(Industry)
    private readonly repo: Repository<Industry>,
  ) {}

  async findAll(params: FindAllParams = {}): Promise<{ data: Industry[]; meta: any }> {
    try {
      const {
        page = 1,
        limit = 10,
        code,
        name,
        description,
        is_active,
        sort,
        order = 'ASC'
      } = params;

      const skip = (page - 1) * limit;
      
      const queryBuilder = this.repo.createQueryBuilder('industry');

      // Add filters
      if (code) {
        queryBuilder.andWhere('industry.code ILIKE :code', { code: `%${code}%` });
      }
      
      if (name) {
        queryBuilder.andWhere('industry.name ILIKE :name', { name: `%${name}%` });
      }
      
      if (description) {
        queryBuilder.andWhere('industry.description ILIKE :description', { description: `%${description}%` });
      }
      
      if (is_active !== undefined) {
        queryBuilder.andWhere('industry.is_active = :is_active', { is_active });
      }

      // Add sorting
      if (sort) {
        queryBuilder.orderBy(`industry.${sort}`, order);
      } else {
        queryBuilder.orderBy('industry.created_at', 'DESC');
      }

      // Add pagination
      queryBuilder.skip(skip).take(limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
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

  async findByCode(code: string): Promise<Industry | null> {
    return this.repo.findOne({ where: { code } });
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