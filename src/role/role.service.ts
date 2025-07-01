import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Menu } from '../menu/entities/menu.entity';
import { Permission } from '../permission/entities/permission.entity';
import { Request } from 'express';
import { In } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto, req: Request): Promise<Role> {
    const currentUser = req.user as any;
    
    const { menuIds, permissionIds, ...roleData } = createRoleDto;
    
    // Create new role entity
    const role = this.roleRepository.create({
      ...roleData,
      createdBy: currentUser.id,
    });
    
    // Add menus if provided
    if (menuIds && menuIds.length > 0) {
      const menus = await this.menuRepository.findBy({ id: In(menuIds) });
      role.menus = menus;
    }
    
    // Add permissions if provided
    if (permissionIds && permissionIds.length > 0) {
      const permissions = await this.permissionRepository.findBy({ id: In(permissionIds) });
      role.permissions = permissions;
    }
    
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { isActive: true },
      relations: ['menus', 'permissions'],
    });
  }

  async findAllWithInactive(): Promise<Role[]> {
    return await this.roleRepository.find({
      relations: ['menus', 'permissions'],
    });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ 
      where: { id },
      relations: ['menus', 'permissions'],
    });
    
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, req: Request): Promise<Role> {
    const { menuIds, permissionIds, ...roleData } = updateRoleDto;
    const currentUser = req.user as any;
    
    const role = await this.findOne(id);
    
    // Update basic role data
    Object.assign(role, {
      ...roleData,
      updatedBy: currentUser.id
    });
    
    // Update menus if provided
    if (menuIds !== undefined) {
      if (menuIds.length > 0) {
        const menus = await this.menuRepository.findBy({ id: In(menuIds) });
        role.menus = menus;
      } else {
        role.menus = [];
      }
    }
    
    // Update permissions if provided
    if (permissionIds !== undefined) {
      if (permissionIds.length > 0) {
        const permissions = await this.permissionRepository.findBy({ id: In(permissionIds) });
        role.permissions = permissions;
      } else {
        role.permissions = [];
      }
    }
    
    return await this.roleRepository.save(role);
  }

  async softDelete(id: string, req: Request): Promise<void> {
    const role = await this.findOne(id);
    const currentUser = req.user as any;
    
    role.isActive = false;
    role.updatedBy = currentUser.id;
    
    await this.roleRepository.save(role);
  }
}