import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nutrition } from './entities/nutrition.entity';
import { TrainerService } from '../trainers/trainer.service';
import { TraineeService } from '../trainees/trainee.service';
import { CreateNutritionDto } from './dtos/createNutrition.dto';
import { updateNutritionDto } from './dtos/updateNutrition.dto';

@Injectable()
export class NutritionService {
  constructor(
    @InjectRepository(Nutrition)
    private readonly nutritionRepository: Repository<Nutrition>,
    private readonly trainerService: TrainerService,
    private readonly traineeService: TraineeService,
  ) {}

  public async createNutrition(
    userTraineeId: number,
    nutrition: CreateNutritionDto,
  ) {
    const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);
    const trainer = trainee.trainer;

    if (trainee.nutrition) {
      throw new BadRequestException('Trainee already has a nutrition plan');
    }

    const newNutrition = this.nutritionRepository.create({
      ...nutrition,
      trainer,
      trainee,
    });

    await this.nutritionRepository.save(newNutrition);
    return newNutrition;
  }

  public async getNutritionsPendingByTrainer(userTrainerId: number) {
    const trainer = await this.trainerService.getTrainerByUserId(userTrainerId);
    const nutritions = await this.nutritionRepository.find({
      where: {
        trainer: { id: trainer.id },
        nutritionStatus: false,
      },
      relations: [
        'trainee',
        'trainer',
        'recommendedFoods',
        'notRecommendedFoods',
      ],
    });

    if (!nutritions.length) {
      throw new NotFoundException('No pending nutrition plans found');
    }
    return nutritions;
  }

  public async getSingleNutrition(nutritionId: number) {
    const nutrition = await this.nutritionRepository.findOne({
      where: { id: nutritionId },
      relations: [
        'trainee',
        'trainer',
        'recommendedFoods',
        'notRecommendedFoods',
      ],
    });

    if (!nutrition) {
      throw new NotFoundException('Nutrition plan not found');
    }
    return nutrition;
  }

  public async approveNutrition(userTrainerId: number, nutritionId: number) {
    const trainer = await this.trainerService.getTrainerByUserId(userTrainerId);
    const nutrition = await this.nutritionRepository.findOne({
      where: {
        id: nutritionId,
        nutritionStatus: false,
      },
      relations: ['trainer'],
    });

    if (!nutrition) {
      throw new NotFoundException('Nutrition plan not found');
    }

    if (nutrition.trainer.id !== trainer.id) {
      throw new BadRequestException(
        'You are not the trainer of this nutrition plan',
      );
    }

    nutrition.nutritionStatus = true;
    await this.nutritionRepository.save(nutrition);
    return nutrition;
  }

  public async getNutritionByTraineeId(userTraineeId: number) {
    const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);
    const nutrition = await this.nutritionRepository.findOne({
      where: { trainee: { id: trainee.id }, nutritionStatus: true },
      relations: [
        'trainee',
        'trainer',
        'recommendedFoods',
        'notRecommendedFoods',
      ],
    });

    if (!nutrition) {
      throw new NotFoundException('Nutrition plan not found');
    }
    return nutrition;
  }

  public async updateNutrition(userTrainerId: number,nutritionId: number, nutrition: updateNutritionDto){
    const trainer = await this.trainerService.getTrainerByUserId(userTrainerId);
    const nutritionPlan = await this.nutritionRepository.findOne({
      where: { id: nutritionId },
      relations: ['trainer', 'trainee', 'recommendedFoods', 'notRecommendedFoods'],
    });

    if (!nutritionPlan) {
      throw new NotFoundException('Nutrition plan not found');
    }

    if (nutritionPlan.trainer.id !== trainer.id) {
      throw new BadRequestException(
        'You are not the trainer of this nutrition plan',
      );
    }

    nutritionPlan.protein = nutrition.protein ?? nutritionPlan.protein;
    nutritionPlan.carb = nutrition.carb ?? nutritionPlan.carb;
    nutritionPlan.calories = nutrition.calories ?? nutritionPlan.calories;

    await this.nutritionRepository.save(nutritionPlan);
    return nutritionPlan;
  }
}
