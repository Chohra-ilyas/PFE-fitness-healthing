import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Day } from './entities/days.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainerService } from 'src/trainers/trainer.service';
import { CreateDayDto } from './dtos/createDay.dto';
import { WorkoutService } from 'src/workout/workout.service';
import { UpdateDayDto } from './dtos/updateDay.dto';
import { CreateDaysDto } from './dtos/createDays.dto';
import { Workout } from 'src/workout/entities/workout.entity';
import { TraineeService } from 'src/trainees/trainee.service';

@Injectable()
export class DaysService {
  constructor(
    @InjectRepository(Day)
    private readonly dayRepository: Repository<Day>,
    private readonly trainerService: TrainerService,
    @Inject(forwardRef(() => WorkoutService))
    private readonly workoutService: WorkoutService,
    private readonly traineeService: TraineeService,
  ) {}

  /**
   * Create a new day
   * @param userTrainerId id of the logged in trainer
   * @param day Data to create a new day
   * @returns new day
   */
  public async createDay(userTrainerId: number, day: CreateDayDto) {
    const workout = await this.workoutService.getsingleWorkout(day.workoutId);
    if (workout.workoutStatus) {
      throw new BadRequestException('Workout is already approved');
    }

    await this.checkTrainer(userTrainerId, workout);

    const days = await this.dayRepository.find({
      where: { workout: { id: day.workoutId } },
    });

    if (days.length >= 7)
      throw new BadRequestException('Workout can only have 7 days');

    const newDay = this.dayRepository.create({ ...day, workout });
    await this.dayRepository.save(newDay);

    return {
      id: newDay.id,
      workoutId: newDay.workout.id,
      dayName: newDay.dayName,
      dayNumber: newDay.dayNumber,
      createdAt: newDay.createdAt,
      updatedAt: newDay.updatedAt,
    };
  }

  public async createDays(
    dayDto: CreateDaysDto,
    workout: Workout,
  ): Promise<Day> {
    const day = this.dayRepository.create({
      dayNumber: dayDto.day,
      dayName: dayDto.name,
      workout,
    });
    await this.dayRepository.save(day);
    return day;
  }

  /**
   * Get a day by id
   * @param dayId id of the day
   * @returns day
   */
  public async getDayById(dayId: number) {
    const day = await this.dayRepository.findOne({
      where: { id: dayId },
      relations: ['workout', 'workout.trainer', 'exercises'],
      order: { dayNumber: 'ASC' },
    });
    if (!day) {
      throw new NotFoundException(`Day with ID ${dayId} not found`);
    }
    return day;
  }

  /**
   * Update a day
   * @param userTrainerId id of the logged in trainer
   * @param dayId id of the day
   * @param updateDayDto Data to update a day
   * @returns updated day
   */
  public async updateDay(
    userTrainerId: number,
    dayId: number,
    updateDayDto: UpdateDayDto,
  ) {
    const day = await this.dayRepository.findOne({
      where: { id: dayId },
      relations: ['workout', 'workout.trainer'],
    });

    if (!day) {
      throw new NotFoundException(`Day with ID ${dayId} not found`);
    }

    if (day.workout.workoutStatus) {
      throw new BadRequestException('Workout is already approved');
    }

    await this.checkTrainer(userTrainerId, day.workout);

    day.dayName = updateDayDto.dayName ?? day.dayName;
    day.dayNumber = updateDayDto.dayNumber ?? day.dayNumber;

    await this.dayRepository.save(day);

    return {
      id: day.id,
      workoutId: day.workout.id,
      dayName: day.dayName,
      dayNumber: day.dayNumber,
      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    };
  }

  public async completeDay(userTraineeId: number, dayId: number) {
    const day = await this.dayRepository.findOne({
      where: { id: dayId },
      relations: ['workout', 'workout.trainee', 'exercises'],
    });

    if (!day) {
      throw new NotFoundException(`Day with ID ${dayId} not found`);
    }

    const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);

    if (day.workout.trainee.id !== trainee.id) {
      throw new ForbiddenException('You are not the trainee of this workout');
    }

    const pastDay = await this.dayRepository.findOne({
      where: { dayNumber: day.dayNumber - 1, workout: { id: day.workout.id } },
      relations: ['workout', 'workout.trainer', 'exercises'],
    });
    if (pastDay) {
      if (!pastDay.isCompleted) {
        throw new BadRequestException(
          'You need to complete the previous day first',
        );
      }
    }

    if (day.dayNumber < 7) {
      day.isCompleted = true;
      await this.dayRepository.save(day);

      return {
        message:
          "congratulations! You've completed this day , move on to the next day",
      };
    } else {
      const days = await this.dayRepository.find({
        where: { workout: { id: day.workout.id } },
        order: { dayNumber: 'ASC' },
      });
      for (const day of days) {
        day.isCompleted = false;
        await this.dayRepository.save(day);
      }
      return {
        message:
          "congratulations! You've completed this week , move on to the next week",
      };
    }
  }

  /**
   * Delete a day
   * @param userTrainerId id of the logged in trainer
   * @param dayId id of the day
   */
  public async deleteDay(userTrainerId: number, dayId: number) {
    const day = await this.dayRepository.findOne({
      where: { id: dayId },
      relations: ['workout', 'workout.trainer', 'exercises'],
    });

    if (!day) {
      throw new NotFoundException(`Day with ID ${dayId} not found`);
    }

    if (day.workout.workoutStatus) {
      throw new BadRequestException('Workout is already approved');
    }

    await this.checkTrainer(userTrainerId, day.workout);

    await this.dayRepository.delete(dayId);

    return { message: 'Day deleted successfully' };
  }

  private async checkTrainer(userTrainerId: number, workout: any) {
    const trainer = await this.trainerService.getTrainerByUserId(userTrainerId);
    if (workout.trainer.id !== trainer.id) {
      throw new ForbiddenException('You are not the trainer of this workout');
    }
  }
}
