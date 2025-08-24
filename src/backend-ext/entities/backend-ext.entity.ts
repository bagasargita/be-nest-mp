import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('m_backend_ext_config')
export class BackendExt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 500 })
  base_url: string;

  @Column({ length: 500, nullable: true })
  token_url: string;

  @Column({ length: 100 })
  client_id: string;

  @Column({ length: 255 })
  client_secret: string;

  @Column({ type: 'text', nullable: true })
  default_scope: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'int', default: 3600 })
  token_expires_in: number;

  @Column({ type: 'json', nullable: true })
  additional_headers: Record<string, string>;

  @Column({ length: 10, default: 'GET' })
  method: string;

  @Column({ length: 500, nullable: true })
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;
}