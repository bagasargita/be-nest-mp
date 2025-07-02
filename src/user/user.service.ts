import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../core/domain/entities/user.entity';
import { Menu } from '../menu/entities/menu.entity';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from 'src/role/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileDto } from './dto/profile-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
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

  async getUserWithPermissions(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, isActive: true },
        relations: { roles: { permissions: true } }
      });
      if (!user) return null;

      const permissions = this.collectUniquePermissions(user.roles);

      const { password, ...userWithoutPassword } = user;
      return { ...userWithoutPassword, permissions };
    } catch (error) {
      console.error(`Error getting permissions for user ${userId}:`, error);
      throw error;
    }
  }

  async findAll(filterDto: FilterUserDto = {}): Promise<User[]> {
    const { search, isActive } = filterDto;
    const query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.isActive = :isActive', { isActive: isActive !== undefined ? isActive : true });

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
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async create(createUserDto: CreateUserDto, createdBy: string): Promise<User> {
    await this.ensureUniqueUsernameEmail(createUserDto.username, createUserDto.email);

    const hashedPassword = await bcrypt.hash(createUserDto.password, await bcrypt.genSalt());
    const user = this.userRepository.create({
      ...(createUserDto.username && { username: createUserDto.username }),
      ...(createUserDto.email && { email: createUserDto.email }),
      ...(createUserDto.firstName && { firstName: createUserDto.firstName }),
      ...(createUserDto.lastName && { lastName: createUserDto.lastName }),
      password: hashedPassword,
      isActive: createUserDto.isActive ?? true,
      createdBy,
      createdAt: new Date(),
    } as Partial<User>);

    if (createUserDto.roleIds?.length) {
      user.roles = await this.roleRepository.find({
        where: { id: In(createUserDto.roleIds), isActive: true }
      });
    }

    return this.userRepository.save(user as User);
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedBy: string): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      await this.ensureUniqueUsername(updateUserDto.username);
    }
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.ensureUniqueEmail(updateUserDto.email);
    }
    if (updateUserDto.newPassword) {
      user.password = await bcrypt.hash(updateUserDto.newPassword, await bcrypt.genSalt());
    }

    Object.assign(user, {
      ...(updateUserDto.email && { email: updateUserDto.email }),
      ...(updateUserDto.username && { username: updateUserDto.username }),
      ...(updateUserDto.isActive !== undefined && { isActive: updateUserDto.isActive }),
      updatedBy,
      updatedAt: new Date()
    });

    if (updateUserDto.roleIds) {
      user.roles = await this.roleRepository.find({
        where: { id: In(updateUserDto.roleIds), isActive: true }
      });
    }

    return this.userRepository.save(user);
  }

  async remove(id: string, updatedBy: string): Promise<void> {
    const user = await this.findOne(id);
    Object.assign(user, { isActive: false, updatedBy, updatedAt: new Date() });
    await this.userRepository.save(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
      select: ['id', 'password']
    });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt());
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  async getUserMenusAndPermissions(userId: string) {    
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
      relations: { roles: true }
    });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const isSuperAdmin = this.isSuperAdmin(user);

    if (isSuperAdmin) {
      const [allMenus, allPermissions] = await Promise.all([
        this.menuRepository.find({ where: { isActive: true }, order: { displayOrder: 'ASC' } }),
        this.permissionRepository.find({ where: { isActive: true } })
      ]);
      return {
        menus: this.buildMenuTree(allMenus.map(this.mapMenu)),
        permissions: allPermissions.map(this.mapPermission)
      };
    }
    
    const userWithRoles = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
      relations: { roles: { menus: true, permissions: true } }
    });

    const { menuMap, permissionMap } = this.collectMenusAndPermissions(userWithRoles?.roles);

    await this.ensureAllParentMenus(menuMap);

    return {
      menus: this.buildMenuTree(Array.from(menuMap.values())),
      permissions: Array.from(permissionMap.values())
    };
  }

  private collectUniquePermissions(roles: Role[] = []) {
    const permissions: Array<{
      id: string;
      code: string;
      name: string;
      resourceType: string;
      actionType: string;
    }> = [];
    const seen = new Set<string>();
    roles?.filter(r => r.isActive).forEach(role => {
      role.permissions?.forEach(permission => {
        if (!seen.has(permission.code)) {
          seen.add(permission.code);
          permissions.push(this.mapPermission(permission));
        }
      });
    });
    return permissions;
  }

  private async ensureUniqueUsernameEmail(username: string, email: string) {
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }]
    });
    if (existingUser) {
      if (existingUser.username === username) {
        throw new BadRequestException(`Username ${username} is already taken`);
      }
      throw new BadRequestException(`Email ${email} is already registered`);
    }
  }

  private async ensureUniqueUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) throw new BadRequestException(`Username ${username} is already taken`);
  }

  private async ensureUniqueEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new BadRequestException(`Email ${email} is already registered`);
  }

  private isSuperAdmin(user: User): boolean {
    const isSuperAdminByRole = user.roles?.some(role =>
      role.name?.toLowerCase() === 'superadmin' && role.isActive
    );
    const isSuperAdminByUsername = user.username?.toLowerCase() === 'superadmin';
    return !!(isSuperAdminByRole || isSuperAdminByUsername);
  }

  private mapMenu(menu: Menu) {
    return {
      id: menu.id,
      name: menu.name,
      path: menu.path,
      icon: menu.icon,
      parentId: menu.parentId,
      displayOrder: menu.displayOrder,
      isActive: menu.isActive
    };
  }

  private mapPermission(permission: Permission) {
    return {
      id: permission.id,
      code: permission.code,
      name: permission.name,
      resourceType: permission.resourceType,
      actionType: permission.actionType
    };
  }

  private collectMenusAndPermissions(roles: Role[] = []) {
    const menuMap = new Map<string, any>();
    const permissionMap = new Map<string, any>();
    
    roles?.filter(r => r.isActive).forEach(role => {      
      role.menus?.filter(m => m.isActive).forEach(menu => {
        if (!menuMap.has(menu.id)) {
          menuMap.set(menu.id, this.mapMenu(menu));
        }
      });
      
      role.permissions?.filter(p => p.isActive).forEach(permission => {
        if (!permissionMap.has(permission.id)) permissionMap.set(permission.id, this.mapPermission(permission));
      });
    });
    
    return { menuMap, permissionMap };
  }

  private async ensureAllParentMenus(menuMap: Map<string, any>) {
    const missingParentIds = new Set<string>();
    
    // Identifikasi parent IDs yang hilang
    menuMap.forEach(menu => {
      if (menu.parentId && !menuMap.has(menu.parentId)) {
        missingParentIds.add(menu.parentId);
      }
    });

    // Lakukan pencarian parent secara rekursif
    while (missingParentIds.size > 0) {      
      const parentMenus = await this.menuRepository.find({
        where: { id: In(Array.from(missingParentIds)) }
      });
      
      missingParentIds.clear();
      
      parentMenus.forEach(parent => {
        if (!menuMap.has(parent.id)) {
          menuMap.set(parent.id, this.mapMenu(parent));
        }
        
        // Periksa apakah parent ini juga memiliki parent yang hilang
        if (parent.parentId && !menuMap.has(parent.parentId)) {
          missingParentIds.add(parent.parentId);
        }
      });
    }
  }

  private buildMenuTree(menus: any[]): any[] {
    const menuMap: Record<string, any> = {};
    const roots: any[] = [];
    const orphans: any[] = [];

    menus.forEach(menu => {
      menuMap[menu.id] = { ...menu, children: [] };
    });

    menus.forEach(menu => {
      if (menu.parentId && menuMap[menu.parentId]) {
        menuMap[menu.parentId].children.push(menuMap[menu.id]);
      } else if (menu.parentId) {
        orphans.push(menuMap[menu.id]);
      } else {
        roots.push(menuMap[menu.id]);
      }
    });

    const phantomParents = new Map();
    orphans.forEach(orphan => {
      if (!phantomParents.has(orphan.parentId)) {
        phantomParents.set(orphan.parentId, {
          id: orphan.parentId,
          name: `Menu Group ${orphan.parentId.substring(0, 4)}`,
          path: `#${orphan.parentId}`,
          children: [],
          displayOrder: 1000
        });
      }
      phantomParents.get(orphan.parentId).children.push(orphan);
    });
    phantomParents.forEach(parent => roots.push(parent));

    const sortChildren = (items) => {
      if (items?.length) {
        items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        items.forEach(item => sortChildren(item.children));
      }
    };
    sortChildren(roots);

    return roots;
  }

  async getUserProfile(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
      select: [
        'id', 'username', 'email', 'firstName', 'lastName',
        'phoneNumber', 'position', 'createdAt'
      ]
    });
    if (!user) throw new NotFoundException('User profile not found');
    return user;
  }

  async updateUserProfile(userId: string, profileDto: ProfileDto, updatedBy: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true }
    });
    if (!user) throw new NotFoundException('User profile not found');

    if (profileDto.email && profileDto.email !== user.email) {
      await this.ensureUniqueEmail(profileDto.email);
    }

    Object.assign(user, {
      ...(profileDto.email && { email: profileDto.email }),
      ...(profileDto.firstName && { firstName: profileDto.firstName }),
      ...(profileDto.lastName && { lastName: profileDto.lastName }),
      ...(profileDto.phoneNumber !== undefined && { phoneNumber: profileDto.phoneNumber }),
      ...(profileDto.position !== undefined && { position: profileDto.position }),
      updatedBy,
      updatedAt: new Date()
    });

    await this.userRepository.save(user);
    return this.getUserProfile(userId);
  }
}
