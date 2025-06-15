import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private readonly repo: Repository<Position>,
  ) {}

  async findAll(): Promise<Position[]> {
    try {
      return this.repo.find();
    } catch (error) {
      throw new Error('Failed to fetch positions: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Position | null> {
    const position = await this.repo.findOne({ where: { id } });
    if (!position) {
      throw new Error(`Position with id ${id} not found`);
    }
    return position;
  }

  async create(dto: CreatePositionDto, username: string): Promise<Position> {
    const entity = this.repo.create({
      ...dto,
      created_by: username,
      created_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdatePositionDto, username: string): Promise<Position> {
    const existingPosition = await this.repo.preload({
      id: id,
      ...dto,
      updated_by: username,
      updated_at: new Date(),
    });
    if (!existingPosition) {
      throw new Error(`Position with id ${id} not found`);
    }
    return this.repo.save(existingPosition);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ id });
    if (result.affected === 0) {
      throw new Error(`Position with id ${id} not found`);
    }
  }
}