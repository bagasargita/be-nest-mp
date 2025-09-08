import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('m_published_package_tier')
export class PublishedPackageTier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 15, scale: 2 })
  min_value: number;

  @Column('decimal', { precision: 15, scale: 2 })
  max_value: number;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  percentage?: number;

  @Column('timestamp')
  start_date: Date;

  @Column('timestamp')
  end_date: Date;

  @Column('varchar', { length: 255 })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @Column('varchar', { length: 255, nullable: true })
  updated_by?: string;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('boolean', { default: true })
  is_active: boolean;
}
