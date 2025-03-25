import {
  BadRequestException,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayload } from 'src/utils/types';
import { FitnessPlanOutputDto } from './dtos/FitnessPlanOutput.dto';
import { NutritionPlanOutputDto } from './dtos/NutritionPlanOutput.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Controller('api/openai-generate-plans')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('/workout-plans')
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  async generateWorkoutPlans(
    @CurrentUser() payload: JWTPayload,
  ): Promise<FitnessPlanOutputDto[]> {
    let attempts = 0;
    let plans: FitnessPlanOutputDto[] = [];

    while (attempts < 3) {
      try {
        plans = await this.openaiService.generateMultipleFitnessPlans(
          payload.id,
        );

        for (const plan of plans) {
          const instance = plainToInstance(FitnessPlanOutputDto, plan);
          await validateOrReject(instance);
        }

        return plans;
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed:`, error);
        if (attempts >= 3) {
          throw new BadRequestException(
            'Invalid workout plan data after multiple attempts',
          );
        }
      }
    }

    throw new BadRequestException('Failed to generate valid workout plans');
  }

  @Post('/nutrition-plans')
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  async generateNutritionPlans(
    @CurrentUser() payload: JWTPayload,
  ): Promise<NutritionPlanOutputDto[]> {
    let attempts = 0;
    let plans: NutritionPlanOutputDto[] = [];

    while (attempts < 3) {
      try {
        plans = await this.openaiService.generateMultipleNutritionPlans(
          payload.id,
        );

        for (const plan of plans) {
          const instance = plainToInstance(NutritionPlanOutputDto, plan);
          await validateOrReject(instance);
        }
        return plans;
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed:`, error);
        if (attempts >= 3) {
          throw new BadRequestException(
            'Invalid nutrition plan data after multiple attempts',
          );
        }
      }
    }

    throw new BadRequestException('Failed to generate valid nutrition plans');
  }

  @Post('/generate-meal-plan')
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  async generateMealPlan(@CurrentUser() payload: JWTPayload) {
    return this.openaiService.generateDayMeal(payload.id);
  }
}
