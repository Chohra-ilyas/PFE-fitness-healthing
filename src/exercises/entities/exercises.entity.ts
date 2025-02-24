import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Day } from '../../days/entities/days.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constanst';
import { StringOrNumberTransformer } from 'src/utils/types';

@Entity({ name: 'exercises' })
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  exerciseName: string;

  @Column({ nullable: true })
  exerciseSets: number;

  @Column({
    nullable: true,
    type: 'varchar',
    transformer: new StringOrNumberTransformer(),
  })
  exerciseReps: string | number;

  @Column({ nullable: true })
  exerciseDuration: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @ManyToOne(() => Day, (day) => day.exercises)
  day: Day;
}
