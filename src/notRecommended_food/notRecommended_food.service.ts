import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotRecommendedFood } from './entities/notRecommended_food.entity';
import { NutritionService } from 'src/nutrition/nutrition.service';
import { CreateNotRecommendedFoodDto } from './dtos/createNotRecommendedFood.dto';
import { UpdateNotRecommendedFoodDto } from './dtos/updateNotRecommendedFood.dto';
import { Nutrition } from 'src/nutrition/entities/nutrition.entity';

@Injectable()
export class NotRecommendedFoodService {
  constructor(
    @InjectRepository(NotRecommendedFood)
    private readonly notRecommendedFoodRepository: Repository<NotRecommendedFood>,
    @Inject(forwardRef(() => NutritionService))
    private readonly nutritionService: NutritionService,
  ) {}

  public async createNotRecommendedFoods(notRecommendedFood:any,nutrition: Nutrition) {
    const newNotRecommendedFood = this.notRecommendedFoodRepository.create({
      ...notRecommendedFood,
      nutrition,
    });
    await this.notRecommendedFoodRepository.save(newNotRecommendedFood);
    return newNotRecommendedFood;
  }

  // Create a not recommended food record
  public async createNotRecommendedFood(
    userTrainerId: number,
    notRecommendedFoodDto: CreateNotRecommendedFoodDto,
  ) {
    const nutrition = await this.nutritionService.getSingleNutrition(
      notRecommendedFoodDto.nutritionId,
    );

    // Check if the nutrition is already approved
    if (nutrition.nutritionStatus) {
      throw new BadRequestException('Nutrition is already approved');
    }

    // Validate that the trainer has access to this nutrition plan
    await this.nutritionService.checkTrainer(userTrainerId, nutrition);

    // Create new not recommended food and associate it with the nutrition plan
    const newNotRecommendedFood = this.notRecommendedFoodRepository.create({
      ...notRecommendedFoodDto,
      nutrition,
    });

    await this.notRecommendedFoodRepository.save(newNotRecommendedFood);
    return {
      id: newNotRecommendedFood.id,
      foodName: newNotRecommendedFood.foodName,
      foodType: newNotRecommendedFood.foodType,
      reasonForNotRecommending: newNotRecommendedFood.reasonForNotRecommending,
      createdAt: newNotRecommendedFood.createdAt,
      updatedAt: newNotRecommendedFood.updatedAt,
    };
  }

  // Retrieve a not recommended food record by its ID
  public async getNotRecommendedFoodById(
    notRecommendedFoodId: number,
  ): Promise<NotRecommendedFood> {
    const notRecommendedFood = await this.notRecommendedFoodRepository.findOne({
      where: { id: notRecommendedFoodId },
      relations: [
        'nutrition',
        'nutrition.trainer',
        'nutrition.notRecommendedFoods',
      ],
    });
    if (!notRecommendedFood) {
      throw new NotFoundException('Not recommended food not found');
    }
    return notRecommendedFood;
  }

  // Update a not recommended food record
  public async updateNotRecommendedFood(
    userTrainerId: number,
    notRecommendedFoodId: number,
    updateNotRecommendedFoodDto: UpdateNotRecommendedFoodDto,
  ) {
    const foodToUpdate =
      await this.getNotRecommendedFoodById(notRecommendedFoodId);

    // Check if the associated nutrition is already approved
    if (foodToUpdate.nutrition.nutritionStatus) {
      throw new BadRequestException('Nutrition is already approved');
    }

    // Validate that the trainer has access to modify this nutrition plan
    await this.nutritionService.checkTrainer(
      userTrainerId,
      foodToUpdate.nutrition,
    );

    // Update fields if provided in the DTO
    foodToUpdate.foodName =
      updateNotRecommendedFoodDto.foodName ?? foodToUpdate.foodName;

    foodToUpdate.foodType =
      updateNotRecommendedFoodDto.foodType ?? foodToUpdate.foodType;

    foodToUpdate.reasonForNotRecommending =
      updateNotRecommendedFoodDto.reasonForNotRecommending ??
      foodToUpdate.reasonForNotRecommending;

    foodToUpdate.problematicComponent =
      updateNotRecommendedFoodDto.problematicComponent ??
      foodToUpdate.problematicComponent;

    await this.notRecommendedFoodRepository.save(foodToUpdate);

    return {
      id: foodToUpdate.id,
      foodName: foodToUpdate.foodName,
      foodType: foodToUpdate.foodType,
      resionForNotRecommending: foodToUpdate.reasonForNotRecommending,
      createdAt: foodToUpdate.createdAt,
      updatedAt: foodToUpdate.updatedAt,
    };
  }

  public async deleteNotRecommendedFood(
    userTrainerId: number,
    notRecommendedFoodId: number,
  ) {
    const notRecommendedFood =
      await this.getNotRecommendedFoodById(notRecommendedFoodId);

    // Check if the associated nutrition is already approved
    if (notRecommendedFood.nutrition.nutritionStatus) {
      throw new BadRequestException('Nutrition is already approved');
    }

    // Validate that the trainer has access to modify this nutrition plan
    await this.nutritionService.checkTrainer(
      userTrainerId,
      notRecommendedFood.nutrition,
    );

    await this.notRecommendedFoodRepository.remove(notRecommendedFood);
  }
}
