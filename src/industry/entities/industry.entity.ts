import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('m_industry')
export class Industry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

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