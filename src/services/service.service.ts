import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, TreeRepository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '../services/service.entity';
import { CreateServiceDto } from '../services/dto/create-service.dto';
import { UpdateServiceDto } from '../services/dto/update-service.dto';

@Injectable()
export class ServiceService {
  private serviceRepository: TreeRepository<Service>;

  constructor(
    private dataSource: DataSource,
  ) {
    this.serviceRepository = this.dataSource.getTreeRepository(Service);
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const { parentId, ...serviceData } = createServiceDto;
    const service = this.serviceRepository.create(serviceData);

    if (parentId) {
      const parent = await this.serviceRepository.findOne({ where: { id: parentId } });
      if (!parent) {
        throw new NotFoundException(`Parent service with ID ${parentId} not found`);
      }
      service.parent = parent;
    }

    return this.serviceRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.findTrees();
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    const { parentId, ...updateData } = updateServiceDto;

    Object.assign(service, updateData);

    if (parentId !== undefined) {
      if (parentId === null) { // Allow unsetting parent
        service.parent = null;
        service.parentId = null;
      } else {
        const parent = await this.serviceRepository.findOne({ where: { id: parentId } });
        if (!parent) {
          throw new NotFoundException(`Parent service with ID ${parentId} not found`);
        }
        service.parent = parent;
        service.parentId = parentId;
      }
    } else if (service.parent) { // Keep existing parent if parentId is not provided in update
        service.parentId = service.parent.id;
    }

    return this.serviceRepository.save(service);
  }

  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
  }
} 