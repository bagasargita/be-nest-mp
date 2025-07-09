import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('m_type_of_business')
export class TypeOfBusiness {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({ type: 'uuid', nullable: true })
  parent_id: string;

  @ManyToOne(() => TypeOfBusiness, (parent) => parent.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: TypeOfBusiness;

  @OneToMany(() => TypeOfBusiness, (child) => child.parent)
  children: TypeOfBusiness[];

  @Column({ default: false })
  is_other: boolean;

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