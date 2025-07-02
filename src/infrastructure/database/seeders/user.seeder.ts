import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../../core/domain/entities/user.entity';
import { Role } from '../../../role/entities/role.entity';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    // Check if users already exist
    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
      console.log('Users already seeded');
      return;
    }

    // Get roles
    const superAdminRole = await roleRepository.findOne({ 
      where: { name: 'SuperAdmin' } 
    });
    
    const adminRole = await roleRepository.findOne({ 
      where: { name: 'Admin' } 
    });

    if (!superAdminRole || !adminRole) {
      console.log('Roles not found. Please run role seeder first.');
      return;
    }

    // Hash passwords
    const saltRounds = 10;
    const password = await bcrypt.hash('admin123', saltRounds);

    // Create superadmin user
    const superadmin = userRepository.create({
      id: uuid(),
      username: 'superadmin',
      password: password,
      email: 'superadmin@example.com',
      firstName: 'Super',
      lastName: 'Admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [superAdminRole]
    });

    // Create admin user
    const admin = userRepository.create({
      id: uuid(),
      username: 'admin',
      password: password,
      email: 'admin@example.com',
      firstName: 'System',
      lastName: 'Administrator',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [adminRole]
    });

    await userRepository.save([superadmin, admin]);
    console.log('User seed completed successfully');
  }
}