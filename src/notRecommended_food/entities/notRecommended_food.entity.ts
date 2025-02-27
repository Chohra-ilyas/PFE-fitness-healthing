import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Nutrition } from '../../nutrition/entities/nutrition.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constanst';

@Entity({ name: 'not_recommended_foods' })
export class NotRecommendedFood {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  foodName: string;

  @Column()
  foodType: string;

  @Column()
  reasonForNotRecommending: string;

  @Column()
  problematicComponent: string; 

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

  @ManyToOne(() => Nutrition, (nutrition) => nutrition.notRecommendedFoods, {
    onDelete: 'CASCADE',
  })
  nutrition: Nutrition;
}
