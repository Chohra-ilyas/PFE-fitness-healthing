import {
  BadRequestException,
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

@Injectable()
export class DaysService {
  constructor(
    @InjectRepository(Day)
    private readonly dayRepository: Repository<Day>,
    private readonly trainerService: TrainerService,
    @Inject(forwardRef(() => WorkoutService))
    private readonly workoutService: WorkoutService,
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

  public async createDays(dayDto: CreateDaysDto, workout: Workout): Promise<Day> {
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
      order : {dayNumber: 'ASC'}
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

    if(day.exercises.length > 0) {
      throw new BadRequestException('Day has exercises, please delete them first');
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
      throw new BadRequestException('You are not the trainer of this workout');
    }
  }
}
