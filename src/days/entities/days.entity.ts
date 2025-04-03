import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workout } from '../../workout/entities/workout.entity';
import { Exercise } from '../../exercises/entities/exercises.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constanst';

@Entity({ name: 'days' })
export class Day {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayName: string;

  @Column()
  dayNumber: number;

  @Column({default: false})
  isCompleted: boolean;

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

  @ManyToOne(() => Workout, (workout) => workout.days, { onDelete: 'CASCADE' })
  workout: Workout;

  @OneToMany(() => Exercise, (exercises) => exercises.day)
  exercises: Exercise[];
}
