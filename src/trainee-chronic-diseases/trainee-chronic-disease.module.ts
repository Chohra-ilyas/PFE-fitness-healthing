import { Module } from '@nestjs/common';
import { TraineeChronicDiseaseController } from './trainee-chronic-disease.controller';
import { TraineeChronicDiseaseService } from './trainee-chronic-disease.service';
import { TraineeChronicDisease } from './entities/Trainee-chronic-disease.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TraineeChronicDisease])],
  controllers: [TraineeChronicDiseaseController],
  providers: [TraineeChronicDiseaseService],
  exports: [TraineeChronicDiseaseService],
})
export class TraineeChronicDiseaseModule {}
