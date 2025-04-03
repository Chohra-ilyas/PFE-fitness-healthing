import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workout } from './entities/workout.entity';
import { Repository } from 'typeorm';
import { TrainerService } from 'src/trainers/trainer.service';
import { TraineeService } from 'src/trainees/trainee.service';
import { WorkoutDto } from './dtos/createCompletWorkout.dto';
import { DaysService } from 'src/days/days.service';
import { ExerciseService } from 'src/exercises/exercises.service';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    private readonly trainerService: TrainerService,
    private readonly traineeService: TraineeService,
    @Inject(forwardRef(() => DaysService))
    private readonly daysService: DaysService,
    private readonly exerciseService: ExerciseService,
  ) {}

  /**
   * Get all pending workouts for a trainer
   * @param userTrainerId id of the logged in trainer
   * @returns all pending workouts for the trainer
   */
  public async getWorkoutsPendingByTrainer(userTrainerId: number) {
    const trainer = await this.trainerService.getTrainerByUserId(userTrainerId);
    const workout = await this.workoutRepository.find({
      where: { trainer: { id: trainer.id }, workoutStatus: false },
      relations: ['trainee', 'trainer', 'days'],
    });
    if (!workout) {
      throw new NotFoundException('No pending workout found');
    }
    return workout;
  }

  /**
   * Get a single workout
   * @param workoutId id of the workout
   * @returns the workout
   */
  public async getsingleWorkout(workoutId: number) {
    const workout = await this.workoutRepository.findOne({
      where: { id: workoutId },
      relations: ['days', 'days.exercises', 'trainer'],
      order: {
        days: {
          dayNumber: 'ASC',
        },
      },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }
    return workout;
  }

  /**
   * Approve a workout
   * @param userTrainerId id of the logged in trainer
   * @param workoutId id of the workout to be approved
   * @returns the approved workout
   */
  public async aproveWorkout(userTrainerId: number, workoutId: number) {
    const trainer = await this.trainerService.getTrainerByUserId(userTrainerId);
    const workout = await this.workoutRepository.findOne({
      where: { id: workoutId, workoutStatus: false },
      relations: ['trainer', 'trainee', 'days', 'days.exercises'],
    });
    if (!workout) {
      throw new NotFoundException('Workout not found');
    }
    if (workout.trainer.id !== trainer.id) {
      throw new BadRequestException('You are not the trainer of this workout');
    }
    if (workout.days.length < 7) {
      throw new BadRequestException('Workout must have at least 7 days');
    }
    workout.workoutStatus = true;
    await this.workoutRepository.save(workout);
    return workout;
  }

  public async createCompletedWorkout(
    userTraineeId: number,
    workoutDto: WorkoutDto,
  ): Promise<Workout> {
    const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);
    if (trainee.workout) {
      throw new BadRequestException('Trainee already has a workout');
    }

    // Create the Workout entity
    const workout = this.workoutRepository.create({
      workoutName: workoutDto.name,
      workoutGenerator: 'Generated-By-IA',
      workoutStatus: true,
      trainee,
    });
    await this.workoutRepository.save(workout);

    return await this.createWorkout(workoutDto, workout);
  }

  public async createPendingCompletedWorkout(
    userTraineeId: number,
    workoutDto: WorkoutDto,
  ): Promise<Workout> {
    const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);
    if (!trainee.trainer) {
      throw new BadRequestException('Trainee does not have a trainer');
    }
    const trainer = trainee.trainer;
    if (trainee.workout) {
      throw new BadRequestException('Trainee already has a workout');
    }

    // Create the Workout entity
    const workout = this.workoutRepository.create({
      workoutName: workoutDto.name,
      workoutGenerator: trainer.user.email,
      workoutStatus: false,
      trainee,
      trainer,
    });
    await this.workoutRepository.save(workout);

    return await this.createWorkout(workoutDto, workout);
  }

  private async createWorkout(workoutDto: WorkoutDto, workout: Workout) {
    // For each day in the workout DTO, delegate creation to DaysService
    for (const dayDto of workoutDto.days) {
      const dayEntity = await this.daysService.createDays(dayDto, workout);

      // For each exercise in that day, delegate creation to ExerciseService
      for (const exerciseDto of dayDto.exercises) {
        await this.exerciseService.createExercises(dayEntity, exerciseDto);
      }
    }

    // Optionally, return the full workout with its days and exercises populated
    return this.workoutRepository.findOne({
      where: { id: workout.id },
      relations: ['days', 'days.exercises'],
      order: {
        days: {
          dayNumber: 'ASC',
        },
      },
    });
  }
}
