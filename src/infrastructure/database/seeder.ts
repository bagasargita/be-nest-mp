import { DataSource } from 'typeorm';
import { runSeeder } from 'typeorm-extension';
import { config } from 'dotenv';
import MenuSeeder from './seeders/menu.seeder';
import PermissionSeeder from './seeders/permission.seeder';
import RoleSeeder from './seeders/role.seeder';
import UserSeeder from './seeders/user.seeder';

//entities
import { Menu } from '../../menu/entities/menu.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { Role } from '../../role/entities/role.entity';
import { User } from '../../core/domain/entities/user.entity';
import { v4 as uuid } from 'uuid';
// Load .env
config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Menu, Permission, Role, User],
  synchronize: false,
});

async function main() {
  try {
    // Initialize connection
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    // Run seeders in order
    console.log('Running Menu seeder...');
    await runSeeder(AppDataSource, MenuSeeder);
    
    console.log('Running Permission seeder...');
    await runSeeder(AppDataSource, PermissionSeeder);
    
    console.log('Running Role seeder...');
    await runSeeder(AppDataSource, RoleSeeder);
    
    console.log('Running User seeder...');
    await runSeeder(AppDataSource, UserSeeder);

    console.log('All seeders completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    // Close connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Data Source connection closed.');
    }
  }
}

// Execute seed function
main();