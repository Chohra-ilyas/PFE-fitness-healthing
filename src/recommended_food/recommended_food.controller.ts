import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { RecommendedFoodService } from './recommended_food.service';
import { CreateRecommendedFoodDto } from './dtos/createRecommendedFood.dto';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { UserType } from 'src/utils/enums';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayload } from 'src/utils/types';
import { updateRecommendedFoodDto } from './dtos/updateRecommendedFood.dto';

@Controller('api/recommended-food')
export class RecommendedFoodController {
  constructor(
    private readonly recommendedFoodService: RecommendedFoodService,
  ) {}

  @Post()
  @Roles(UserType.TRAINER, UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  public async createRecommendedFood(
    @CurrentUser() payload: JWTPayload,
    @Body() recommendedFood: CreateRecommendedFoodDto,
  ) {
    return this.recommendedFoodService.createRecommendedFood(
      payload.id,
      recommendedFood,
    );
  }

  @Put('/:recommendedFoodId')
  @Roles(UserType.TRAINER, UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  public async updateRecommendedFood(
    @CurrentUser() payload: JWTPayload,
    @Param('recommendedFoodId', ParseIntPipe) recommendedFoodId: number,
    @Body() recommendedFood: updateRecommendedFoodDto,
  ) {
    return this.recommendedFoodService.updateRecommendedFood(
      payload.id,
      recommendedFoodId,
      recommendedFood,
    );
  }

  @Delete('/:recommendedFoodId')
  @Roles(UserType.TRAINER, UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  public async deleteRecommendedFood(
    @CurrentUser() payload: JWTPayload,
    @Param('recommendedFoodId', ParseIntPipe) recommendedFoodId: number,
  ) {
    return this.recommendedFoodService.deleteRecommendedFood(
      payload.id,
      recommendedFoodId,
    );
  }
}
