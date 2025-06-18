import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BatchingDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  frequency: 'PerShift' | 'EndOfTheDay' | 'NextDay';

  @Column({ nullable: true })
  hour?: number;
}
