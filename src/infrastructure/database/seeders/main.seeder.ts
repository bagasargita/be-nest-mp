import { DataSource } from 'typeorm';
import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension';
import MenuSeeder from './menu.seeder';
import PermissionSeeder from './permission.seeder';
import RoleSeeder from './role.seeder';
import UserSeeder from './user.seeder';

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    // Run seeders in proper order to respect dependencies
    await runSeeder(dataSource, MenuSeeder);
    await runSeeder(dataSource, PermissionSeeder);
    await runSeeder(dataSource, RoleSeeder);
    await runSeeder(dataSource, UserSeeder);
  }
}