import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../../core/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

// Load .env
config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);

  // Cek apakah user sudah ada
  const existing = await userRepo.findOne({ where: { username: 'admin' } });
  if (existing) {
    console.log('User admin already exists');
    await AppDataSource.destroy();
    return;
  }

  const hashed = await bcrypt.hash('admin123', 10);

  const user = userRepo.create({
    username: 'superadmin',
    password: hashed,
    firstName: 'Super',
    lastName: 'Admin',
    isActive: true,
  });

  await userRepo.save(user);
  console.log('Seed user admin created!');
  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});