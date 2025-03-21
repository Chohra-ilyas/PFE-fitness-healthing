import { ChronicDisease } from 'src/chronic-diseases/entities/chronic-diseases.entity';
import { Trainee } from 'src/trainees/entities/trainee.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'trainee_chronic_diseases' })
export class TraineeChronicDisease {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Trainee, (trainee) => trainee.chronicDiseaseLinks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  trainee: Trainee;

  @ManyToOne(() => ChronicDisease, (disease) => disease.traineeChronicDiseaseLink, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  chronicDisease: ChronicDisease;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
