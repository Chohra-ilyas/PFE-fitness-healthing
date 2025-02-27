import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendedFood } from './entities/recommended_food.entity';
import { NutritionService } from 'src/nutrition/nutrition.service';
import { CreateRecommendedFoodDto } from './dtos/createRecommendedFood.dto';
import { updateRecommendedFoodDto } from './dtos/updateRecommendedFood.dto';
import { create } from 'domain';
import { UsersService } from 'src/users/users.service';
import { UserType } from 'src/utils/enums';
import { Nutrition } from 'src/nutrition/entities/nutrition.entity';

@Injectable()
export class RecommendedFoodService {
  constructor(
    @InjectRepository(RecommendedFood)
    private readonly recommendedFoodRepository: Repository<RecommendedFood>,
    @Inject(forwardRef(() => NutritionService))
    private readonly nutritionService: NutritionService,
    private readonly userService: UsersService,
  ) {}

  public async createRecommendedFoods(recommendedFood:any,nutrition: Nutrition) {
    const newRecommendedFood = this.recommendedFoodRepository.create({
      ...recommendedFood,
      nutrition,
    });
    await this.recommendedFoodRepository.save(newRecommendedFood);
    return newRecommendedFood;
  }

  public async createRecommendedFood(
    userId: number,
    recommendedFood: CreateRecommendedFoodDto,
  ): Promise<RecommendedFood> {
    const nutrition = await this.nutritionService.getSingleNutrition(
      recommendedFood.nutritionId,
    );
    const user = await this.userService.getCurrentUser(userId);
    if (user.userType === UserType.TRAINER) {
      if (nutrition.nutritionStatus) {
        throw new BadRequestException('Nutrition is already approved');
      }
      await this.nutritionService.checkTrainer(userId, nutrition);
    } else if (user.userType === UserType.TRAINEE) {
      await this.nutritionService.checkTrainee(userId, nutrition);
    }

    const newRecommendedFood = this.recommendedFoodRepository.create({
      ...recommendedFood,
      nutrition,
    });
    await this.recommendedFoodRepository.save(newRecommendedFood);
    return newRecommendedFood;
  }

  public async getRecommendedFoodById(recommendedFoodId: number) {
    const recommendedFood = await this.recommendedFoodRepository.findOne({
      where: { id: recommendedFoodId },
      relations: ['nutrition', 'nutrition.trainer', 'nutrition.trainee'],
    });
    if (!recommendedFood) {
      throw new NotFoundException('Recommended food not found');
    }
    return recommendedFood;
  }

  public async updateRecommendedFood(
    userId: number,
    recommendedFoodId: number,
    recommendedFoodDto: updateRecommendedFoodDto,
  ) {
    const recommendedFoodToUpdate =
      await this.getRecommendedFoodById(recommendedFoodId);

    const user = await this.userService.getCurrentUser(userId);
    if (user.userType === UserType.TRAINER) {
      if (recommendedFoodToUpdate.nutrition.nutritionStatus) {
        throw new BadRequestException('Nutrition is already approved');
      }
      await this.nutritionService.checkTrainer(
        userId,
        recommendedFoodToUpdate.nutrition,
      );
    } else if (user.userType === UserType.TRAINEE) {
      await this.nutritionService.checkTrainee(
        userId,
        recommendedFoodToUpdate.nutrition,
      );
    }

    recommendedFoodToUpdate.foodType =
      recommendedFoodDto.foodType ?? recommendedFoodToUpdate.foodType;
    recommendedFoodToUpdate.foodName =
      recommendedFoodDto.foodName ?? recommendedFoodToUpdate.foodName;

    await this.recommendedFoodRepository.save(recommendedFoodToUpdate);
    return {
      id: recommendedFoodToUpdate.id,
      foodType: recommendedFoodToUpdate.foodType,
      foodName: recommendedFoodToUpdate.foodName,
      createdAt: recommendedFoodToUpdate.createdAt,
      updatedAt: recommendedFoodToUpdate.updatedAt,
    };
  }

  public async deleteRecommendedFood(
    userId: number,
    recommendedFoodId: number,
  ) {
    const recommendedFood =
      await this.getRecommendedFoodById(recommendedFoodId);
    const user = await this.userService.getCurrentUser(userId);
    if (user.userType === UserType.TRAINER) {
      if (recommendedFood.nutrition.nutritionStatus) {
        throw new BadRequestException('Nutrition is already approved');
      }
      await this.nutritionService.checkTrainer(
        userId,
        recommendedFood.nutrition,
      );
    } else if (user.userType === UserType.TRAINEE) {
      await this.nutritionService.checkTrainee(
        userId,
        recommendedFood.nutrition,
      );
    }
    await this.recommendedFoodRepository.remove(recommendedFood);
    return { message: 'Recommended food deleted successfully' };
  }
}
