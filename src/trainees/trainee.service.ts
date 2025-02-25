import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Trainee } from './entities/trainee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UserType } from 'src/utils/enums';
import { RegisterTraineeDto } from './dtos/registerTrainee.dto';
import { UpdateTraineeDto } from './dtos/updateTrainee.dto';
import { TrainerService } from 'src/trainers/trainer.service';

@Injectable()
export class TraineeService {
  constructor(
    @InjectRepository(Trainee)
    private readonly traineesRepository: Repository<Trainee>,
    private readonly usersService: UsersService,
    private readonly trainersService: TrainerService,
  ) {}

  /**
   * Create a new Trainer
   * @param userId id of the logged in user
   * @param createTrainerDto Data to create a new trainer
   * @returns new trainer
   */
  public async registerTrainee(dto: RegisterTraineeDto, userId: number) {
    let user = await this.usersService.getCurrentUser(userId);
    if (user.userType === UserType.TRAINEE)
      throw new BadRequestException('User is already a trainee');
    if (user.userType === UserType.TRAINER)
      throw new BadRequestException('User is a trainer');
    user.userType = UserType.TRAINEE;
    this.usersService.updateUserType(user.id, user.userType);
    const trainee = await this.traineesRepository.create({ ...dto, user });
    await this.traineesRepository.save(trainee);
    return trainee;
  }

  /**
   * Get all trainees
   * @returns all trainees
   */
  async getAllTrainees(): Promise<Trainee[]> {
    return await this.traineesRepository.find({
      relations: ['user', 'trainer', 'reviews', 'workout', 'nutrition'],
    });
  }

  /**
   * Get trainee by user ID
   * @param userId id of the logged in user
   * @returns trainee
   */
  async getTraineeByUserId(userId: number): Promise<Trainee> {
    const trainee = await this.traineesRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'trainer', 'reviews','workout', 'nutrition'],
    });

    if (!trainee) {
      throw new NotFoundException(`Trainee with user ID ${userId} not found.`);
    }

    return trainee;
  }

  /**
   * Update trainee by user ID
   * @param userId id of the logged in user
   * @param updateTraineeDto Data to update trainee
   * @returns updated trainee
   */
  async updateTrainee(userId: number, updateTrainerDto: UpdateTraineeDto) {
    // Find the trainer by user ID
    const trainee = await this.traineesRepository.findOneBy({
      user: { id: userId },
    });
    if (!trainee) {
      throw new NotFoundException(`Trainer with user ID ${userId} not found.`);
    }

    // Update the trainer
    await this.traineesRepository.update(trainee.id, updateTrainerDto);

    // Fetch and return the updated trainer
    const updatedTrainer = await this.traineesRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    return updatedTrainer;
  }

  /**
   * Assign a trainer to a trainee
   * @param userId id of the logged in user
   * @param trainerId id of the trainer to assign
   * @returns updated trainee
   */
  async assignTrainer(userId: number, trainerId: number) {
    let trainee = await this.traineesRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'trainer'],
    });
    const trainer = await this.trainersService.getTrainerById(trainerId);
    if (!trainee) {
      throw new NotFoundException(`Trainee with user ID ${userId} not found.`);
    }
    if (trainee.trainer) {
      throw new BadRequestException('Trainee is already assigned to a trainer');
    }
    if (!trainer) {
      throw new NotFoundException(`Trainer not found.`);
    }
    if (trainer.maximumTrainees <= trainer.numberOfTrainees) {
      throw new BadRequestException('Trainer is full');
    }

    // Increment the number of trainees for the trainer
    this.trainersService.increaseTrainee(trainer.id);

    // Assign the trainer to the trainee
    trainee.trainer = trainer;
    await this.traineesRepository.save(trainee);
    return trainee;
  }
}
