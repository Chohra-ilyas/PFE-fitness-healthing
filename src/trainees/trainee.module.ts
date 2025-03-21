import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Trainee } from './entities/trainee.entity';
import { TraineeService } from './trainee.service';
import { TraineeController } from './trainee.controller';
import { TrainerModule } from 'src/trainers/trainer.module';
import { ChronicDiseasesModule } from 'src/chronic-diseases/chronic-diseases.module';
import { TraineeChronicDiseaseModule } from 'src/trainee-chronic-diseases/trainee-chronic-disease.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trainee]),
    UsersModule,
    JwtModule,
    TrainerModule,
    ChronicDiseasesModule,
    TraineeChronicDiseaseModule
  ],
  controllers: [TraineeController],
  providers: [TraineeService],
  exports: [TraineeService],
})
export class TraineeModule {}
