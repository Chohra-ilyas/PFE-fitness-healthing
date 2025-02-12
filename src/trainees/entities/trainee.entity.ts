import { CurrentState } from 'src/current-states/entities/currentState.entity';
import { Nutrition } from 'src/nutrition/entities/nutrition.entity';
import { Review } from 'src/reviews/entities/reviews.entity';
import { Trainer } from 'src/trainers/entities/trainer.entity';
import { User } from 'src/users/user.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constanst';
import { Gender, Goal } from 'src/utils/enums';
import { Workout } from 'src/workout/entities/workout.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'trainees' })
export class Trainee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  age: number;

  @Column()
  weight: number;

  @Column()
  height: number;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'enum', enum: Goal, nullable: true })
  goal: Goal;

  @Column({ nullable: true })
  chronicalDiseases: string;

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

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @OneToOne(() => Workout, (workout) => workout.trainee, { nullable: true })
  workout: Workout;

  @OneToOne(() => Nutrition, (nutrition) => nutrition.trainee, {
    nullable: true,
  })
  nutrition: Nutrition;

  @ManyToOne(() => Trainer, (trainer) => trainer.trainees, {
    nullable: true,
  })
  trainer: Trainer;

  @OneToMany(() => Review, (review) => review.trainee, { eager: true })
  reviews: Review[];

  @OneToMany(() => CurrentState, (currentState) => currentState.trainee, {
    eager: true,
  })
  currentState: CurrentState[];
}
