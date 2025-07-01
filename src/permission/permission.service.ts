import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Request } from 'express';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, req: Request): Promise<Permission> {
    const currentUser = req.user as any;
    
    const permission = this.permissionRepository.create({
      ...createPermissionDto,
      createdBy: currentUser.id,
    });
    return await this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return await this.permissionRepository.find({
      where: { isActive: true }
    });
  }

  async findAllWithInactive(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({ 
      where: { id }
    });
    
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, req: Request): Promise<Permission> {
    const permission = await this.findOne(id);
    const currentUser = req.user as any;
    
    Object.assign(permission, {
      ...updatePermissionDto,
      updatedBy: currentUser.id
    });
    
    return await this.permissionRepository.save(permission);
  }

  async softDelete(id: string, req: Request): Promise<void> {
    const permission = await this.findOne(id);
    const currentUser = req.user as any;
    
    permission.isActive = false;
    permission.updatedBy = currentUser.id;
    
    await this.permissionRepository.save(permission);
  }

  async findByCode(code: string): Promise<Permission | null> {
    return await this.permissionRepository.findOne({ 
      where: { code, isActive: true } 
    });
  }
}