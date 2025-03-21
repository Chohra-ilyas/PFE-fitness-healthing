import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TraineeChronicDisease } from './entities/Trainee-chronic-disease.entity';
import { Repository } from 'typeorm';
import { Trainee } from 'src/trainees/entities/trainee.entity';
import { ChronicDisease } from 'src/chronic-diseases/entities/chronic-diseases.entity';

@Injectable()
export class TraineeChronicDiseaseService {
  constructor(
    @InjectRepository(TraineeChronicDisease)
    private readonly traineeChronicDiseasesRepository: Repository<TraineeChronicDisease>,
  ) {}

  async createTraineeChronicDisease(
    trainee: Trainee,
    chronicDisease: ChronicDisease,
  ) {
    const diseaseLink = await this.traineeChronicDiseasesRepository.findOne({
      where: {
        trainee: { id: trainee.id },
        chronicDisease: { id: chronicDisease.id },
      },
    });
    if (!diseaseLink) {
      const traineeChronicDisease =
        this.traineeChronicDiseasesRepository.create({
          trainee,
          chronicDisease,
        });
      await this.traineeChronicDiseasesRepository.save(traineeChronicDisease);
      return traineeChronicDisease;
    }
  }
}
