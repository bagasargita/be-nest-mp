import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/domain/entities/base.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ unique: true })
  code: string; // e.g., "menu:create", "user:delete"

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  resourceType: string; // e.g., "menu", "user"

  @Column()
  actionType: string; // e.g., "create", "read", "update", "delete"

  @Column({ default: true })
  isActive: boolean;
}