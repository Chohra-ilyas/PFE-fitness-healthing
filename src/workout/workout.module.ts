import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './entities/workout.entity';
import { TrainerModule } from 'src/trainers/trainer.module';
import { TraineeModule } from 'src/trainees/trainee.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workout]),
    TrainerModule,
    TraineeModule,
    UsersModule,
    JwtModule
  ],
  controllers: [WorkoutController],
  providers: [WorkoutService],
  exports: [WorkoutService]
})
export class WorkoutModule {}
