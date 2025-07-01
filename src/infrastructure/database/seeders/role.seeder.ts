import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Role } from '../../../role/entities/role.entity';
import { Menu } from '../../../menu/entities/menu.entity';
import { Permission } from '../../../permission/entities/permission.entity';
import { v4 as uuid } from 'uuid';

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const roleRepository = dataSource.getRepository(Role);
    const menuRepository = dataSource.getRepository(Menu);
    const permissionRepository = dataSource.getRepository(Permission);

    // Check if roles already exist
    const existingRoles = await roleRepository.find();
    if (existingRoles.length > 0) {
      console.log('Roles already seeded');
      return;
    }

    // Get all menus
    const allMenus = await menuRepository.find({ where: { isActive: true } });
    
    // Get all permissions
    const allPermissions = await permissionRepository.find({ where: { isActive: true } });

    // Create superadmin role with all menus and permissions
    const superAdminRole = roleRepository.create({
      id: uuid(),
      name: 'SuperAdmin',
      description: 'Super Administrator with full access',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      menus: allMenus,
      permissions: allPermissions
    });

    // Create admin role with limited permissions
    const adminRole = roleRepository.create({
      id: uuid(),
      name: 'Admin',
      description: 'Administrator with limited access',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Assign dashboard and user management
      menus: allMenus.filter(menu => 
        menu.path === '/dashboard' || 
        menu.path === '/users'
      ),
      // Assign only user permissions
      permissions: allPermissions.filter(permission => 
        permission.resourceType === 'user'
      )
    });

    await roleRepository.save([superAdminRole, adminRole]);
    console.log('Role seed completed successfully');
  }
}