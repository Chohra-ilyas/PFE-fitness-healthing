import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workout } from './entities/workout.entity';
import { Repository } from 'typeorm';
import { TrainerService } from 'src/trainers/trainer.service';
import { TraineeService } from 'src/trainees/trainee.service';
import { CreateWorkoutDto } from './dtos/createWorkout.dto';

@Injectable()
export class WorkoutService {
    constructor(
        @InjectRepository(Workout)
        private readonly workoutRepository: Repository<Workout>,
        private readonly trainerService: TrainerService,
        private readonly traineeService: TraineeService,
    ){}

    public async createWorkout(userTraineeId: number,workout: CreateWorkoutDto){
        const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);
        const trainer = trainee.trainer;
        if(trainee.workout){
            throw new BadRequestException('Trainee already has a workout');
        }
        const newWorkout = this.workoutRepository.create({...workout, trainer, trainee});
        await this.workoutRepository.save(newWorkout);
        return newWorkout;
    }

    public async getWorkoutsPendingByTrainer(userTrainerId: number){
        const trainer = await this.trainerService.getTrainerByUserId(userTrainerId);
        const workout = await this.workoutRepository.find({
            where: { trainer : { id: trainer.id }, workoutStatus: false},
            relations: ['trainee', 'trainer', 'days'],
        });
        if(!workout){
            throw new NotFoundException('No pending workout found');
        }
        return workout;
    }

    public async getsingleWorkout(workoutId: number){
        const workout = await this.workoutRepository.findOne({
            where: { id: workoutId },
            relations: ['trainee', 'trainer', 'days', 'days.exercises'],
        });
        if(!workout){
            throw new NotFoundException('Workout not found');
        }
        return workout;
    }

    public async aproveWorkout(userTrainerId: number,workoutId: number){
        const trainer = await this.trainerService.getTrainerByUserId(userTrainerId);
        const workout = await this.workoutRepository.findOne({
            where: { id: workoutId, workoutStatus: false},
            relations: ['trainer']
        });
        if(!workout){
            throw new NotFoundException('Workout not found');
        }
        if(workout.trainer.id !== trainer.id){
            throw new BadRequestException('You are not the trainer of this workout');
        }
        workout.workoutStatus = true;
        await this.workoutRepository.save(workout);
        return workout;
    }
}
