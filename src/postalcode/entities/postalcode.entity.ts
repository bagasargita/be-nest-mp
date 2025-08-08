import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('m_postal_code')
export class Postalcode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  postal_code: string;

  @Column({ type: 'varchar', length: 255 })
  sub_district: string;

  @Column({ type: 'varchar', length: 255 })
  district: string;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @Column({ type: 'varchar', length: 255 })
  province: string;

  @Column({ type: 'varchar', length: 255 })
  country: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ length: 50 })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ length: 50, nullable: true })
  updated_by: string;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}