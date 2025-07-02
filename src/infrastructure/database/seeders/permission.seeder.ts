import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Permission } from '../../../permission/entities/permission.entity';
import { v4 as uuid } from 'uuid';

export default class PermissionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const permissionRepository = dataSource.getRepository(Permission);

    // Check if permissions already exist
    const existingPermissions = await permissionRepository.find();
    if (existingPermissions.length > 0) {
      console.log('Permissions already seeded');
      return;
    }

    // Define resource types
    const resources = ['user', 'role', 'menu', 'permission'];
    // Define actions
    const actions = ['create', 'read', 'update', 'delete'];

    const permissions: any[] = [];

    // Generate permissions for each resource and action
    for (const resource of resources) {
      for (const action of actions) {
        permissions.push({
          id: uuid(),
          code: `${resource}:${action}`,
          name: `${action.charAt(0).toUpperCase() + action.slice(1)} ${
            resource.charAt(0).toUpperCase() + resource.slice(1)
          }`,
          description: `Permission to ${action} ${resource}s`,
          resourceType: resource,
          actionType: action,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await permissionRepository.insert(permissions);
    console.log('Permission seed completed successfully');
  }
}