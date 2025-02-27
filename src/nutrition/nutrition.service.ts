import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
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
import { RecommendedFoodService } from 'src/recommended_food/recommended_food.service';
import { NotRecommendedFoodService } from 'src/notRecommended_food/notRecommended_food.service';
import { NutritionPlanDto } from './dtos/createNutritionPlan';

@Injectable()
export class NutritionService {
  constructor(
    @InjectRepository(Nutrition)
    private readonly nutritionRepository: Repository<Nutrition>,
    private readonly trainerService: TrainerService,
    private readonly traineeService: TraineeService,
    @Inject(forwardRef(() => RecommendedFoodService))
    private readonly recommendedFoodService: RecommendedFoodService,
    @Inject(forwardRef(() => NotRecommendedFoodService))
    private readonly notRecommendedFoodService: NotRecommendedFoodService,
  ) {}

  public async createNutritionPlan(
    userTraineeId: number,
    nutritionDto: NutritionPlanDto,
  ) {
    const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);
    if (trainee.nutrition) {
      throw new BadRequestException('Trainee already has a nutrition plan');
    }
    const newNutrition = this.nutritionRepository.create({
      proteins: nutritionDto.proteins,
      carbs: nutritionDto.carbs,
      calories: nutritionDto.calories,
      generator: 'generated-By-IA',
      nutritionStatus: true,
      trainee,
    });
    await this.nutritionRepository.save(newNutrition);

    return await this.createNutrition(nutritionDto, newNutrition);
  }

  public async createNutritionPlanToModifyByTrainer(
    userTraineeId: number,
    nutritionDto: NutritionPlanDto,
  ) {
    const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);
    if(!trainee.trainer){
      throw new BadRequestException('Trainee does not have a trainer');
    }
    const trainer = trainee.trainer
    if (trainee.nutrition) {
      throw new BadRequestException('Trainee already has a nutrition plan');
    }
    const newNutrition = this.nutritionRepository.create({
      proteins: nutritionDto.proteins,
      carbs: nutritionDto.carbs,
      calories: nutritionDto.calories,
      generator: trainer.user.email,
      nutritionStatus: false,
      trainee,
      trainer
    });
    await this.nutritionRepository.save(newNutrition);

    return await this.createNutrition(nutritionDto, newNutrition);
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

  public async updateNutrition(
    userTrainerId: number,
    nutritionId: number,
    nutrition: updateNutritionDto,
  ) {
    const trainer = await this.trainerService.getTrainerByUserId(userTrainerId);
    const nutritionPlan = await this.nutritionRepository.findOne({
      where: { id: nutritionId },
      relations: [
        'trainer',
        'trainee',
        'recommendedFoods',
        'notRecommendedFoods',
      ],
    });

    if (!nutritionPlan) {
      throw new NotFoundException('Nutrition plan not found');
    }

    if (nutritionPlan.trainer.id !== trainer.id) {
      throw new BadRequestException(
        'You are not the trainer of this nutrition plan',
      );
    }

    nutritionPlan.proteins = nutrition.protein ?? nutritionPlan.proteins;
    nutritionPlan.carbs = nutrition.carb ?? nutritionPlan.carbs;
    nutritionPlan.calories = nutrition.calories ?? nutritionPlan.calories;

    await this.nutritionRepository.save(nutritionPlan);
    return nutritionPlan;
  }

  public async checkTrainer(userTrainerId: number, nutrition: Nutrition) {
    const trainer = await this.trainerService.getTrainerByUserId(userTrainerId);
    if (nutrition.trainer.id !== trainer.id) {
      throw new ForbiddenException('You are not the trainer of this nutrition');
    }
  }

  public async checkTrainee(userTraineeId: number, nutrition: Nutrition) {
    const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);
    if (nutrition.trainee.id !== trainee.id) {
      throw new ForbiddenException('You are not the trainee of this nutrition');
    }
  }

  private async createNutrition(
    nutritionDto: NutritionPlanDto,
    newNutrition: Nutrition,
  ) {
    for (const food of nutritionDto.recommendedFoods) {
      const recommendedFood =
        await this.recommendedFoodService.createRecommendedFoods(
          food,
          newNutrition,
        );
    }

    for (const food of nutritionDto.notRecommendedFoods) {
      const notRecommendedFood =
        await this.notRecommendedFoodService.createNotRecommendedFoods(
          food,
          newNutrition,
        );
    }

    return await this.nutritionRepository.findOne({
      where: { id: newNutrition.id },
      relations: [
        'trainee',
        'trainer',
        'recommendedFoods',
        'notRecommendedFoods',
      ],
    });
  }
}
