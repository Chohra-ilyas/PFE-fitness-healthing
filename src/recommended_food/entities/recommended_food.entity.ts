import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Nutrition } from '../../nutrition/entities/nutrition.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constanst';

@Entity({ name: 'recommended_foods' })
export class RecommendedFood {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  foodType: string;

  @Column()
  foodName: string;

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

  @ManyToOne(() => Nutrition, (nutrition) => nutrition.recommendedFoods, {
    onDelete: 'CASCADE',
  })
  nutrition: Nutrition;
}
