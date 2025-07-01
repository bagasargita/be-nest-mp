import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions, Seeder, SeederFactoryManager } from 'typeorm-extension';
import MainSeeder from './seeders/main.seeder';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables from .env
config();
const configService = new ConfigService();

// Database configuration
const options: DataSourceOptions & SeederOptions = {
  type: 'postgres', // or your database type
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  seeds: [MainSeeder],
};

export const AppDataSource = new DataSource(options);