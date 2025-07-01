import { Entity, Column, ManyToOne, OneToMany, 
    JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../core/domain/entities/base.entity';

@Entity('menus')
export class Menu extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  path: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  parentId: string;

  @ManyToOne(() => Menu, menu => menu.children, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parentId' })
  parent: Menu;

  @OneToMany(() => Menu, menu => menu.parent)
  children: Menu[];

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isActive: boolean;
}