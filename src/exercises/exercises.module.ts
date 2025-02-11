import { Module } from '@nestjs/common';
import { ExerciseService } from './exercises.service';
import { ExerciseController } from './exercises.controller';
import { Exercise } from './entities/exercises.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TraineeModule } from 'src/trainees/trainee.module';
import { TrainerModule } from 'src/trainers/trainer.module';
import { WorkoutModule } from 'src/workout/workout.module';
import { DaysModule } from 'src/days/days.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise]),
    UsersModule,
    JwtModule,
    TraineeModule,
    TrainerModule,
    WorkoutModule,
    DaysModule,
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
})
export class ExercisesModule {}
