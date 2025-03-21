import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CURRENT_TIMESTAMP } from 'src/utils/constanst';
import { TraineeChronicDisease } from 'src/trainee-chronic-diseases/entities/Trainee-chronic-disease.entity';

@Entity({ name: 'chronicDiseases' })
export class ChronicDisease {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chronicDiseaseName: string;

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

  @OneToMany(
    () => TraineeChronicDisease,
    (traineeChronicDiseaseLink) => traineeChronicDiseaseLink.chronicDisease,
  )
  traineeChronicDiseaseLink: TraineeChronicDisease[];
}
