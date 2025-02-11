import { Trainee } from 'src/trainees/entities/trainee.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constanst';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('current_states')
export class CurrentState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', nullable: false })
  currentWeight: number;

  @Column({ type: 'float', nullable: false })
  currentHeight: number;

  @Column({ type: 'int', nullable: false })
  currentAge: number;

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

  @ManyToOne(() => Trainee, (trainee) => trainee.currentState , { onDelete: 'CASCADE'})
  trainee: Trainee;
}