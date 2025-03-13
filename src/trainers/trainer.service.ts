import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterTrainerDto } from './dtos/registerTrainer.dto';
import { Repository } from 'typeorm';
import { Trainer } from './entities/trainer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UserType } from 'src/utils/enums';
import { UpdateTrainerDto } from './dtos/updateTrainer.dto';

@Injectable()
export class TrainerService {
  constructor(
    @InjectRepository(Trainer)
    private readonly trainersRepository: Repository<Trainer>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create a new Trainer
   * @param userId id of the logged in user
   * @param createTrainerDto Data to create a new trainer
   * @returns new trainer
   */
  public async registerTrainer(dto: RegisterTrainerDto, userId: number) {
    let user = await this.usersService.getCurrentUser(userId);
    if (user.userType !== UserType.NORMAL_User)
      throw new BadRequestException('User is already a trainee or trainer');
    user.userType = UserType.TRAINER;
    this.usersService.updateUserType(user.id, user.userType);
    const trainer = await this.trainersRepository.create({ ...dto, user });
    await this.trainersRepository.save(trainer);
    return trainer;
  }

  /**
   * Get all trainers
   * @returns all trainers
   */
  async getAllTrainers(): Promise<Trainer[]> {
    return await this.trainersRepository.find({
      relations: ['user'], // Load the related User entity
    });
  }

  /**
   * Get trainer by user ID
   * @param userId id of the logged in user
   * @returns trainer
   */
  async getTrainerByUserId(userId: number): Promise<Trainer> {
    const trainer = await this.trainersRepository.findOne({
      where: { user: { id: userId } }, // Match User ID
      relations: ['user'], // Ensure the User relation is loaded
    });

    if (!trainer) {
      throw new NotFoundException(`Trainee with user ID ${userId} not found.`);
    }

    return trainer;
  }

  async getTrainerById(trainerId: number): Promise<Trainer> {
    const trainer = await this.trainersRepository.findOne({
      where: { id: trainerId },
      relations: ['user'], // Ensure the User relation is loaded
    });

    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${trainerId} not found.`);
    }

    return trainer;
  }

  /**
   * update trainer
   * @param userId id of the logged in user
   * @param updateTrainerDto Data to create a new trainer
   * @returns new trainer
   */
  async updateTrainer(userId: number, updateTrainerDto: UpdateTrainerDto) {
    // Find the trainer by user ID
    const trainer = await this.trainersRepository.findOneBy({
      user: { id: userId },
    });
    if (!trainer) {
      throw new NotFoundException(`Trainer with user ID ${userId} not found.`);
    }

    // Update the trainer
    await this.trainersRepository.update(trainer.id, updateTrainerDto);

    // Fetch and return the updated trainer
    const updatedTrainer = await this.trainersRepository.findOne({
      where: { user: { id: userId } }, // Match User ID
      relations: ['user'], // Ensure the User relation is loaded
    });
    return updatedTrainer;
  }

  public async increaseTrainee(trainerId: number) {
    const trainer = await this.getTrainerById(trainerId);
    trainer.numberOfTrainees += 1;
    await this.trainersRepository.save(trainer);
  }

  public async calculateRating(trainerUserId: number) {
    const trainerReview = await this.getTrainerByUserId(trainerUserId);
    let trainerRating = trainerReview.rating;
    trainerReview.reviews.map((review) => {
      trainerRating += review.rating;
    });
    if(trainerReview.reviews.length===0){
      trainerRating = 0;
    }else{
      trainerRating /= trainerReview.reviews.length;
      trainerReview.rating = trainerRating;
    }
    
    await this.trainersRepository.save(trainerReview);
  }
}
