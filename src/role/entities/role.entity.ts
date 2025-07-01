import { Entity, Column, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../core/domain/entities/base.entity';
import { Menu } from '../../menu/entities/menu.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Menu)
  @JoinTable({
    name: 'role_menus',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menuId', referencedColumnName: 'id' }
  })
  menus: Menu[];

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' }
  })
  permissions: Permission[];

  @Column({ default: true })
  isActive: boolean;
}