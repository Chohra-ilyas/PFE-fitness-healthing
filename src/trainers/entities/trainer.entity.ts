import { CURRENT_TIMESTAMP } from 'src/utils/constanst';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Trainee } from 'src/trainees/entities/trainee.entity';
import { Review } from 'src/reviews/entities/reviews.entity';
import { Workout } from 'src/workout/entities/workout.entity';
import { Nutrition } from 'src/nutrition/entities/nutrition.entity';

@Entity({ name: 'trainers' })
export class Trainer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  experienceYears: number;

  @Column({ default: 0 })
  numberOfTrainees: number;

  @Column()
  maximumTrainees: number;

  @Column()
  specialization: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  rating: number;

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

  @OneToMany(() => Workout, (workout) => workout.trainer , { eager: true })
  workouts: Workout[];

  @OneToMany(() => Nutrition, (nutrition) => nutrition.trainer , { eager: true })
  nutrition: Nutrition[];

  @OneToMany(() => Trainee, (trainee) => trainee.trainer , { eager: true })
  trainees: Trainee[];

  @OneToMany(() => Review, (review) => review.trainer , { eager: true })
  reviews: Review[];
}
