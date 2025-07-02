import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Request } from 'express';
import { Permission } from 'src/permission/entities/permission.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Menu[]> {
    return await this.menuRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' }
    });
  }

  async findAllWithInactive(): Promise<Menu[]> {
    return await this.menuRepository.find({
      order: { displayOrder: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id }
    });
    
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    
    return menu;
  }

  async create(createMenuDto: CreateMenuDto, req: any): Promise<Menu> {
    const currentUser = req.user;
    
    // Create the menu
    const menu = this.menuRepository.create({
      ...createMenuDto,
      createdBy: currentUser.id,
    });
    
    const savedMenu = await this.menuRepository.save(menu);
    
    // Auto-create permissions for this menu
    await this.createPermissionsForMenu(savedMenu, currentUser.id);
    
    return savedMenu;
  }

  /**
   * Create permissions for a new menu
   */
  private async createPermissionsForMenu(menu: Menu, userId: string): Promise<void> {
    // Extract resource type from menu path
    const resourceType = this.extractResourceTypeFromPath(menu.path);
    
    if (!resourceType) {
      return;
    }
    
    // Define standard actions
    const actions = ['create', 'read', 'update', 'delete'];
    
    // Create permissions for each action
    const permissions: Permission[] = [];
    
    for (const action of actions) {
      permissions.push({
        id: uuid(),
        code: `${resourceType}:${action}`,
        name: `${action.charAt(0).toUpperCase() + action.slice(1)} ${
          resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
        }`,
        description: `Permission to ${action} ${resourceType}`,
        resourceType,
        actionType: action,
        isActive: true,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Permission);
    }
    
    try {
      // Check if permissions already exist with the same code
      for (const permission of permissions) {
        const existingPermission = await this.permissionRepository.findOne({
          where: { code: permission.code }
        });
        
        if (!existingPermission) {
          await this.permissionRepository.save(permission);
        }
      }
      
    } catch (error) {
      console.error('Error creating permissions for menu:', error);
    }
  }

  /**
   * Extract resource type from menu path
   */
  private extractResourceTypeFromPath(path: string): string | null {
    if (!path) return null;
    
    // Remove leading and trailing slashes
    const cleanPath = path.replace(/^\/|\/$/g, '');
    
    // For nested paths like /settings/users, extract the last part
    const pathSegments = cleanPath.split('/');
    if (pathSegments.length === 0) return null;
    
    // Get the last segment
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // If it ends with 's', use the singular form
    const resourceType = lastSegment.endsWith('s')
      ? lastSegment.substring(0, lastSegment.length - 1)
      : lastSegment;
    
    return resourceType;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto, req: Request): Promise<Menu> {
    const menu = await this.findOne(id);
    const currentUser = req.user as any;
    
    Object.assign(menu, {
      ...updateMenuDto,
      updatedBy: currentUser.id
    });
    
    return await this.menuRepository.save(menu);
  }

  async softDelete(id: string, req: Request): Promise<void> {
    const menu = await this.findOne(id);
    const currentUser = req.user as any;
    
    // Soft delete - just mark as inactive
    menu.isActive = false;
    menu.updatedBy = currentUser.id;
    
    await this.menuRepository.save(menu);
  }

  async getMenuTree(): Promise<any[]> {
    const allMenus = await this.findAll();
    return this.buildMenuTree(allMenus);
  }

  private buildMenuTree(
    menus: Menu[],
    parentId: string | null = null
  ): (Menu & { children: any[] })[] {
    const result: (Menu & { children: any[] })[] = [];
    
    menus
      .filter(menu => menu.parentId === parentId)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .forEach(menu => {
        const children = this.buildMenuTree(menus, menu.id);
        result.push({
          ...menu,
          children: children.length > 0 ? children : []
        });
      });
      
    return result;
  }
}

import { v4 as uuidv4 } from 'uuid';

function uuid(): string {
  return uuidv4();
}
