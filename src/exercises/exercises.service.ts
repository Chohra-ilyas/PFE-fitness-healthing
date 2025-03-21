import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { Exercise } from './entities/exercises.entity';
  import { Repository } from 'typeorm';
  import { InjectRepository } from '@nestjs/typeorm';
  import { CreateExerciseDto } from './dtos/createExercise.dto';
  import { UpdateExerciseDto } from './dtos/updateExercise.dto';
  import { DaysService } from 'src/days/days.service';
  import { TrainerService } from 'src/trainers/trainer.service';
import { Day } from 'src/days/entities/days.entity';
import { CreateExercisesDto } from './dtos/createExesices.dto';
  
  @Injectable()
  export class ExerciseService {
    constructor(
      @InjectRepository(Exercise)
      private readonly exerciseRepository: Repository<Exercise>,
      private readonly daysService: DaysService,
      private readonly trainerService: TrainerService,
    ) {}
  
    /**
     * Create a new exercise
     * @param userTrainerId id of the logged in trainer
     * @param exercise Data to create a new exercise
     * @returns new exercise
     */
    public async createExercise(userTrainerId: number, exercise: CreateExerciseDto) {
      const day = await this.daysService.getDayById(exercise.dayId);
      if (!day) {
        throw new NotFoundException(`Day with ID ${exercise.dayId} not found`);
      }
      if(day.workout.workoutStatus){
        throw new BadRequestException('You cannot add exercise to a completed workout');
      }
  
      await this.checkTrainer(userTrainerId, day.workout);
  
      const newExercise = this.exerciseRepository.create({ ...exercise, day });
      await this.exerciseRepository.save(newExercise);
  
      return {
        id: newExercise.id,
        dayId: newExercise.day.id,
        exerciseName: newExercise.exerciseName,
        exerciseSets: newExercise.exerciseSets,
        exerciseReps: newExercise.exerciseReps,
        createdAt: newExercise.createdAt,
        updatedAt: newExercise.updatedAt,
      };
    }

    public async createExercises(day: Day, exerciseDto: CreateExercisesDto): Promise<Exercise> {
      const exercise = this.exerciseRepository.create({
        exerciseName: exerciseDto.exercise,
        exerciseSets: exerciseDto.sets,
        exerciseReps: exerciseDto.reps,
        exerciseDuration: exerciseDto.duration,
        day,
      });
      await this.exerciseRepository.save(exercise);
      return exercise;
    }
  
    /**
     * Update an exercise
     * @param userTrainerId id of the logged in trainer
     * @param exerciseId id of the exercise
     * @param updateExerciseDto Data to update an exercise
     * @returns updated exercise
     */
    public async updateExercise(
      userTrainerId: number,
      exerciseId: number,
      updateExerciseDto: UpdateExerciseDto,
    ) {
      const exercise = await this.exerciseRepository.findOne({
        where: { id: exerciseId },
        relations: ['day', 'day.workout', 'day.workout.trainer'],
      });
  
      if (!exercise) {
        throw new NotFoundException(`Exercise with ID ${exerciseId} not found`);
      }
      if(exercise.day.workout.workoutStatus){
        throw new BadRequestException('You cannot update exercise of a completed workout');
      }
  
      await this.checkTrainer(userTrainerId, exercise.day.workout);
  
      exercise.exerciseName = updateExerciseDto.exerciseName ?? exercise.exerciseName;
      exercise.exerciseSets = updateExerciseDto.exerciseSets ?? exercise.exerciseSets;
      exercise.exerciseReps = updateExerciseDto.exerciseReps ?? exercise.exerciseReps;
  
      await this.exerciseRepository.save(exercise);
  
      return {
        id: exercise.id,
        dayId: exercise.day.id,
        exerciseName: exercise.exerciseName,
        exerciseSets: exercise.exerciseSets,
        exerciseReps: exercise.exerciseReps,
        createdAt: exercise.createdAt,
        updatedAt: exercise.updatedAt,
      };
    }
  
    /**
     * Delete an exercise
     * @param userTrainerId id of the logged in trainer
     * @param exerciseId id of the exercise
     */
    public async deleteExercise(userTrainerId: number, exerciseId: number) {
      const exercise = await this.exerciseRepository.findOne({
        where: { id: exerciseId },
        relations: ['day', 'day.workout', 'day.workout.trainer'],
      });
  
      if (!exercise) {
        throw new NotFoundException(`Exercise with ID ${exerciseId} not found`);
      }

      if(exercise.day.workout.workoutStatus){
        throw new BadRequestException('You cannot delete exercise of a completed workout');
      }
  
      await this.checkTrainer(userTrainerId, exercise.day.workout);
  
      await this.exerciseRepository.delete(exerciseId);
  
      return { message: 'Exercise deleted successfully' };
    }
  
    private async checkTrainer(userTrainerId: number, workout: any) {
      const trainer = await this.trainerService.getTrainerByUserId(userTrainerId);
      if (workout.trainer.id !== trainer.id) {
        throw new ForbiddenException('You are not the trainer of this workout');
      }
    }
  }