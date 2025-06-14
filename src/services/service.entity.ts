import { Entity, Column, PrimaryGeneratedColumn, Tree, TreeParent, TreeChildren, ManyToOne, JoinColumn } from 'typeorm';

@Entity('services')
@Tree('closure-table')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  type: string; // e.g., 'Setor Tunai', 'Non Tunai', 'E-Wallet', 'Domestic', 'International'

  @TreeParent()
  parent: Service | null;

  @TreeChildren()
  children: Service[];

  @Column({ nullable: true })
  parentId: string | null; // To store the parent ID for easier querying if needed, though TreeParent handles it.
} 