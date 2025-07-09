import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
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
      const results = await this.repo.find({
        relations: ['parent', 'children'],
        order: { name: 'ASC' }
      });
      
      // Sort to put "Other" entries at the bottom
      return results.sort((a, b) => {
        if (a.is_other && !b.is_other) return 1;
        if (!a.is_other && b.is_other) return -1;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      throw new Error('Failed to fetch types of business: ' + error.message);
    }
  }

  async findParents(): Promise<TypeOfBusiness[]> {
    try {
      const parents = await this.repo.find({
        where: { parent_id: IsNull() },
        relations: ['children'],
        order: { name: 'ASC' }
      });
      
      // Sort with "Other" at the bottom
      return parents.sort((a, b) => {
        if (a.is_other && !b.is_other) return 1;
        if (!a.is_other && b.is_other) return -1;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      throw new Error('Failed to fetch parent types of business: ' + error.message);
    }
  }

  async findChildren(parentId: string): Promise<TypeOfBusiness[]> {
    try {
      const children = await this.repo.find({
        where: { parent_id: parentId },
        relations: ['parent'],
        order: { name: 'ASC' }
      });
      
      // Sort with "Other" at the bottom
      return children.sort((a, b) => {
        if (a.is_other && !b.is_other) return 1;
        if (!a.is_other && b.is_other) return -1;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      throw new Error('Failed to fetch child types of business: ' + error.message);
    }
  }

  async findTree(): Promise<TypeOfBusiness[]> {
    try {
      const parents = await this.repo.find({
        where: { parent_id: IsNull() },
        order: { name: 'ASC' }
      });
      
      // Load children for each parent and sort with "Other" at the bottom
      for (const parent of parents) {
        const children = await this.repo.find({
          where: { parent_id: parent.id },
          order: { name: 'ASC' }
        });
        
        // Sort children with "Other" at the bottom
        parent.children = children.sort((a, b) => {
          if (a.is_other && !b.is_other) return 1;
          if (!a.is_other && b.is_other) return -1;
          return a.name.localeCompare(b.name);
        });
      }
      
      // Sort parents with "Other" at the bottom
      return parents.sort((a, b) => {
        if (a.is_other && !b.is_other) return 1;
        if (!a.is_other && b.is_other) return -1;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      throw new Error('Failed to fetch types of business tree: ' + error.message);
    }
  }

  async findOne(id: string): Promise<TypeOfBusiness | null> {
    const typeOfBusiness = await this.repo.findOne({ 
      where: { id },
      relations: ['parent', 'children']
    });
    if (!typeOfBusiness) {
      throw new Error(`TypeOfBusiness with id ${id} not found`);
    }
    return typeOfBusiness;
  }

  async create(dto: CreateTypeOfBusinessDto, username: string): Promise<TypeOfBusiness> {
    // Validate parent exists if parent_id is provided
    if (dto.parent_id) {
      const parent = await this.repo.findOne({ where: { id: dto.parent_id } });
      if (!parent) {
        throw new Error(`Parent type of business with id ${dto.parent_id} not found`);
      }
    }

    const entity = this.repo.create({
      ...dto,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateTypeOfBusinessDto, username: string): Promise<TypeOfBusiness> {
    // Validate parent exists if parent_id is provided
    if (dto.parent_id) {
      const parent = await this.repo.findOne({ where: { id: dto.parent_id } });
      if (!parent) {
        throw new Error(`Parent type of business with id ${dto.parent_id} not found`);
      }
      
      // Prevent circular reference
      if (dto.parent_id === id) {
        throw new Error('Cannot set self as parent');
      }
    }

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
    // Check if has children
    const children = await this.repo.find({ where: { parent_id: id } });
    if (children.length > 0) {
      throw new Error('Cannot delete type of business that has children');
    }

    const result = await this.repo.delete({ id });
    if (result.affected === 0) {
      throw new Error(`TypeOfBusiness with id ${id} not found`);
    }
  }
}