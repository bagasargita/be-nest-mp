import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Menu } from '../../../menu/entities/menu.entity';
import { v4 as uuid } from 'uuid';

export default class MenuSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const menuRepository = dataSource.getRepository(Menu);

    // Check if menus already exist
    const existingMenus = await menuRepository.find();
    if (existingMenus.length > 0) {
      console.log('Menus already seeded');
      return;
    }

    // Create parent menus
    const dashboardId = uuid();
    const settingsId = uuid();
    
    // Child menus under Settings
    const userManagementId = uuid();
    const roleManagementId = uuid();
    const menuManagementId = uuid();
    
    const menus = [
      {
        id: dashboardId,
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'DashboardOutlined',
        parentId: undefined,
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: settingsId,
        name: 'Settings',
        path: '/settings',
        icon: 'SettingOutlined',
        parentId: undefined,
        displayOrder: 99, // Put at the bottom
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // User management
      {
        id: userManagementId,
        name: 'User Management',
        path: '/users',
        icon: 'UserOutlined',
        parentId: settingsId,
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Role management
      {
        id: roleManagementId,
        name: 'Role Management',
        path: '/roles',
        icon: 'TeamOutlined',
        parentId: settingsId,
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Menu management
      {
        id: menuManagementId,
        name: 'Menu Management',
        path: '/menus',
        icon: 'MenuOutlined',
        parentId: settingsId,
        displayOrder: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await menuRepository.insert(menus);
    console.log('Menu seed completed successfully');
  }
}