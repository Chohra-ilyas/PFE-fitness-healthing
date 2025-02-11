import { Module } from '@nestjs/common';
import { DaysService } from './days.service';
import { DaysController } from './days.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Day } from './entities/days.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TraineeModule } from 'src/trainees/trainee.module';
import { TrainerModule } from 'src/trainers/trainer.module';
import { WorkoutModule } from 'src/workout/workout.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Day]),
    UsersModule,
    JwtModule,
    TraineeModule,
    TrainerModule,
    WorkoutModule
  ],
  controllers: [DaysController],
  providers: [DaysService],
  exports: [DaysService],
})
export class DaysModule {}
