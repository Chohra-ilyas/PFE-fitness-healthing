import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { NotRecommendedFoodService } from './notRecommended_food.service';
import { CreateNotRecommendedFoodDto } from './dtos/createNotRecommendedFood.dto';
import { UpdateNotRecommendedFoodDto } from './dtos/updateNotRecommendedFood.dto';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { UserType } from 'src/utils/enums';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayload } from 'src/utils/types';

@Controller('api/not-recommended-food')
export class NotRecommendedFoodController {
  constructor(private readonly notRecommendedFoodService: NotRecommendedFoodService) {}
  @Post()
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  public async createNotRecommendedFood(
    @CurrentUser() payload: JWTPayload,
    @Body() notRecommendedFood: CreateNotRecommendedFoodDto,
  ) {
    return this.notRecommendedFoodService.createNotRecommendedFood(
      payload.id,
      notRecommendedFood,
    );
  }

  @Put('/:notRecommendedFoodId')
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  public async updateNotRecommendedFood(
    @CurrentUser() payload: JWTPayload,
    @Param('notRecommendedFoodId', ParseIntPipe) notRecommendedFoodId: number,
    @Body() notRecommendedFood: UpdateNotRecommendedFoodDto,
  ) {
    return this.notRecommendedFoodService.updateNotRecommendedFood(
      payload.id,
      notRecommendedFoodId,
      notRecommendedFood,
    );
  }

  @Delete('/:notRecommendedFoodId')
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  public async deleteNotRecommendedFood(
    @CurrentUser() payload: JWTPayload,
    @Param('notRecommendedFoodId', ParseIntPipe) notRecommendedFoodId: number,
  ) {
    return this.notRecommendedFoodService.deleteNotRecommendedFood(
      payload.id,
      notRecommendedFoodId,
    );
  }
}
