import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Day } from '../../days/entities/days.entity';
import { Trainee } from 'src/trainees/entities/trainee.entity';
import { Trainer } from 'src/trainers/entities/trainer.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constanst';

@Entity({ name: 'workouts' })
export class Workout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  workoutName: string;

  @Column({ default: false })
  workoutStatus: boolean;

  @Column({ nullable: true })
  workoutGenerator: string;

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

  @OneToOne(() => Trainee, (trainee) => trainee.workout)
  @JoinColumn()
  trainee: Trainee;

  @ManyToOne(() => Trainer, (trainer) => trainer.workouts, { nullable: true })
  trainer: Trainer;

  @OneToMany(() => Day, (day) => day.workout)
  days: Day[];
}
