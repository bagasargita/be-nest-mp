import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../core/domain/entities/user.entity';
import { Menu } from '../menu/entities/menu.entity';
import { Permission } from '../permission/entities/permission.entity';
import { In } from 'typeorm';

@Injectable()
export class UserService {
  getUserWithPermissions(userId: any) {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>
  ) {}

  // Metode lain dari service...

  async getUserMenusAndPermissions(userId: string) {
    // Gunakan findOne dengan opsi relations yang tepat
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
      relations: {
        roles: true
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Periksa apakah user adalah superadmin (username atau role)
    const isSuperAdminByRole = user.roles?.some(role => 
      role.name.toLowerCase() === 'superadmin' && role.isActive
    );
    
    const isSuperAdminByUsername = user.username.toLowerCase() === 'superadmin';
    const isSuperAdmin = isSuperAdminByRole || isSuperAdminByUsername;

    // Jika superadmin (username atau role), berikan akses ke semua menu dan permission
    if (isSuperAdmin) {
      // Ambil semua menu yang aktif
      const allMenus = await this.menuRepository.find({
        where: { isActive: true },
        order: { displayOrder: 'ASC' }
      });

      // Ambil semua permission yang aktif
      const allPermissions = await this.permissionRepository.find({
        where: { isActive: true }
      });

      // Gunakan helper untuk memformat data sesuai kebutuhan frontend
      const menuItems = allMenus.map(menu => ({
        id: menu.id,
        name: menu.name,
        path: menu.path,
        icon: menu.icon,
        parentId: menu.parentId,
        displayOrder: menu.displayOrder,
        isActive: menu.isActive
      }));

      const permissionItems = allPermissions.map(perm => ({
        id: perm.id,
        code: perm.code,
        name: perm.name,
        resourceType: perm.resourceType,
        actionType: perm.actionType
      }));

      return {
        menus: this.buildMenuTree(menuItems),
        permissions: permissionItems,
      };
    } else {
      // Untuk non-superadmin, gunakan logika yang ada
      // Ambil detail role dengan menu dan permissions
      const userWithRoles = await this.userRepository.findOne({
        where: { id: userId, isActive: true },
        relations: {
          roles: {
            menus: true,
            permissions: true
          }
        }
      });

      // Use Map to ensure uniqueness and fast lookup
      const menuMap = new Map<string, any>();
      const permissionMap = new Map<string, any>();

      // Tangani kasus jika userWithRoles atau roles adalah null/undefined
      if (userWithRoles && userWithRoles.roles && userWithRoles.roles.length > 0) {
        // Iterate through active roles only
        userWithRoles.roles.filter(role => role.isActive).forEach(role => {
          // Tambahkan menu dari role ini jika active
          if (role.menus && role.menus.length > 0) {
            role.menus.filter(menu => menu.isActive).forEach(menu => {
              if (!menuMap.has(menu.id)) {
                // Sertakan hanya data yang diperlukan
                menuMap.set(menu.id, {
                  id: menu.id,
                  name: menu.name,
                  path: menu.path,
                  icon: menu.icon,
                  parentId: menu.parentId,
                  displayOrder: menu.displayOrder,
                  isActive: menu.isActive
                });
              }
            });
          }

          // Tambahkan permission dari role ini
          if (role.permissions && role.permissions.length > 0) {
            role.permissions.filter(perm => perm.isActive).forEach(permission => {
              if (!permissionMap.has(permission.id)) {
                permissionMap.set(permission.id, {
                  id: permission.id,
                  code: permission.code,
                  name: permission.name,
                  resourceType: permission.resourceType,
                  actionType: permission.actionType
                });
              }
            });
          }
        });
      }

      return {
        menus: this.buildMenuTree(Array.from(menuMap.values())),
        permissions: Array.from(permissionMap.values()),
      };
    }
  }

  // Metode private untuk membangun struktur menu tree
  private buildMenuTree(menus: any[]): any[] {
    // Implementasi buildMenuTree tetap sama seperti sebelumnya...
    const menuMap: Record<string, any> = {};
    const roots: any[] = [];

    // Pertama, buat map dari semua menu item dengan children array kosong
    menus.forEach(menu => {
      menuMap[menu.id] = { ...menu, children: [] };
    });

    // Kemudian, hubungkan children ke parent mereka
    menus.forEach(menu => {
      if (menu.parentId && menuMap[menu.parentId]) {
        menuMap[menu.parentId].children.push(menuMap[menu.id]);
      } else {
        // Jika tidak memiliki parent atau parent tidak ditemukan, ini adalah root
        roots.push(menuMap[menu.id]);
      }
    });

    // Urutkan menu berdasarkan displayOrder jika ada
    roots.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    // Urutkan juga children di setiap level
    const sortChildren = (items) => {
      if (items && items.length > 0) {
        items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        items.forEach(item => {
          if (item.children && item.children.length > 0) {
            sortChildren(item.children);
          }
        });
      }
    };
    
    sortChildren(roots);
    
    return roots;
  }
}