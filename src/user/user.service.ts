import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../core/domain/entities/user.entity';
import { Menu } from '../menu/entities/menu.entity';
import { Permission } from '../permission/entities/permission.entity';
import { In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/role/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  /**
   * Find all active users with their roles.
   * @returns Promise<User[]>
   */
  async findAll(filterDto: FilterUserDto = {}): Promise<User[]> {
    const { search, isActive } = filterDto;
    const query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles');

    // Apply filters if provided
    if (isActive !== undefined) {
      query.andWhere('user.isActive = :isActive', { isActive });
    } else {
      // Default to active users only
      query.andWhere('user.isActive = :isActive', { isActive: true });
    }

    if (search) {
      query.andWhere(
        '(user.username LIKE :search OR user.email LIKE :search OR user.fullName LIKE :search)',
        { search: `%${search}%` }
      );
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
      relations: { roles: true }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto, createdBy: string): Promise<User> {
    // Check if username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email }
      ]
    });

    if (existingUser) {
      if (existingUser.username === createUserDto.username) {
        throw new BadRequestException(`Username ${createUserDto.username} is already taken`);
      } else {
        throw new BadRequestException(`Email ${createUserDto.email} is already registered`);
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Create user entity
    const user = this.userRepository.create({
      // Only include properties that exist in the User entity
      // If 'username', 'email', 'fullName', etc. are not defined in User entity, remove them here
      // Add only the properties that are defined in User entity
      ...(typeof createUserDto.username !== 'undefined' && { username: createUserDto.username }),
      ...(typeof createUserDto.email !== 'undefined' && { email: createUserDto.email }),
      ...(typeof createUserDto.firstName !== 'undefined' && { firstName: createUserDto.firstName }),
      ...(typeof createUserDto.lastName !== 'undefined' && { lastName: createUserDto.lastName }),
      password: hashedPassword,
      isActive: createUserDto.isActive ?? true,
      createdBy,
      createdAt: new Date(),
    } as Partial<User>);

    // Handle role assignments if provided
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const roles = await this.roleRepository.find({
        where: { id: In(createUserDto.roleIds), isActive: true }
      });
      user.roles = roles;
    }

    const savedUser = await this.userRepository.save(user as User);
    return savedUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedBy: string): Promise<User> {
    const user = await this.findOne(id);
    
    // Check for unique constraints if updating username or email
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.userRepository.findOne({
        where: { username: updateUserDto.username }
      });
      if (existingUsername) {
        throw new BadRequestException(`Username ${updateUserDto.username} is already taken`);
      }
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email }
      });
      if (existingEmail) {
        throw new BadRequestException(`Email ${updateUserDto.email} is already registered`);
      }
    }

    // Handle password change if provided
    if (updateUserDto.newPassword) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, salt);
      user.password = hashedPassword;
    }

    // Update basic fields
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.username) user.username = updateUserDto.username;
    if (updateUserDto.isActive !== undefined) user.isActive = updateUserDto.isActive;
    
    user.updatedBy = updatedBy;
    user.updatedAt = new Date();

    // Update role assignments if provided
    if (updateUserDto.roleIds) {
      const roles = await this.roleRepository.find({
        where: { id: In(updateUserDto.roleIds), isActive: true }
      });
      user.roles = roles;
    }

    return this.userRepository.save(user);
  }

  async remove(id: string, updatedBy: string): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    user.updatedBy = updatedBy;
    user.updatedAt = new Date();
    await this.userRepository.save(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    // Find the user
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
      select: ['id', 'password']
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user with new password
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

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