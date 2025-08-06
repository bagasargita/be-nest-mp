import { Entity, PrimaryGeneratedColumn, Column, Tree, TreeChildren, TreeParent, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('m_cdm_provider')
@Tree('closure-table')
export class CdmProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @TreeParent()
  parent: CdmProvider | null;

  @TreeChildren()
  children: CdmProvider[];

  @Column({ type: 'varchar', length: 50 })
  created_by: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  updated_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
