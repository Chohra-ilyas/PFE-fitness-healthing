import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RecommendedFood } from '../../recommended_food/entities/recommended_food.entity';
import { NotRecommendedFood } from '../../notRecommended_food/entities/notRecommended_food.entity';
import { Trainee } from 'src/trainees/entities/trainee.entity';
import { Trainer } from 'src/trainers/entities/trainer.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constanst';

@Entity({ name: 'nutrition' })
export class Nutrition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  nutritionStatus: boolean;

  @Column({ nullable: true })
  generator: string;

  @Column('float', { default: 0 })
  protein: number;

  @Column('float', { default: 0 })
  carb: number;

  @Column('float', { default: 0 })
  calories: number;

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

  @OneToOne(() => Trainee, (trainee) => trainee.nutrition)
  @JoinColumn()
  trainee: Trainee;

  @ManyToOne(() => Trainer, (trainer) => trainer.nutrition)
  trainer: Trainer;

  @OneToMany(
    () => RecommendedFood,
    (recommendedFood) => recommendedFood.nutrition,
    { cascade: true },
  )
  recommendedFoods: RecommendedFood[];

  @OneToMany(
    () => NotRecommendedFood,
    (notRecommendedFood) => notRecommendedFood.nutrition,
    { cascade: true },
  )
  notRecommendedFoods: NotRecommendedFood[];
}
