import { Trainee } from 'src/trainees/entities/trainee.entity';
import { Trainer } from 'src/trainers/entities/trainer.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constanst';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  comment: string;

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

  @ManyToOne(() => Trainer, (trainer) => trainer.reviews , { onDelete: 'CASCADE' })
  trainer : Trainer;

  @ManyToOne(() => Trainee, (trainee) => trainee.reviews , { onDelete: 'CASCADE' })
  trainee : Trainee;
}
