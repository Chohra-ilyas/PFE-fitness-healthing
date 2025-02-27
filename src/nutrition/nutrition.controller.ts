import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { Roles } from '../users/decorators/user-role.decorator';
import { UserType } from '../utils/enums';
import { AuthRolesGuard } from '../users/guards/auth-role.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { JWTPayload } from '../utils/types';
import { AuthGuard } from '../users/guards/auth.guard';
import { CreateNutritionDto } from './dtos/createNutrition.dto';
import { updateNutritionDto } from './dtos/updateNutrition.dto';
import { NutritionPlanDto } from './dtos/createNutritionPlan';

@Controller('api/nutritions')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Post()
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  createNutrition(
    @CurrentUser() payload: JWTPayload,
    @Body() nutrition: NutritionPlanDto,
  ) {
    return this.nutritionService.createNutritionPlan(payload.id, nutrition);
  }

  @Post('/to-trainer')
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  createNutritionToModify(
    @CurrentUser() payload: JWTPayload,
    @Body() nutrition: NutritionPlanDto,
  ) {
    return this.nutritionService.createNutritionPlanToModifyByTrainer(payload.id, nutrition);
  }

  @Get('/pending-nutritions')
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  getNutritionsByTrainer(@CurrentUser() payload: JWTPayload) {
    return this.nutritionService.getNutritionsPendingByTrainer(payload.id);
  }

  @Get('/my-nutritions')
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  getNutritionsByTrainee(@CurrentUser() payload: JWTPayload) {
    return this.nutritionService.getNutritionByTraineeId(payload.id);
  }

  @Get('/:nutritionId')
  @UseGuards(AuthGuard)
  getSingleNutrition(@Param('nutritionId', ParseIntPipe) nutritionId: number) {
    return this.nutritionService.getSingleNutrition(nutritionId);
  }

  @Put('/aprove-nutritions/:nutritionId')
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  approveNutrition(
    @CurrentUser() payload: JWTPayload,
    @Param('nutritionId', ParseIntPipe) nutritionId: number,
  ) {
    return this.nutritionService.approveNutrition(payload.id, nutritionId);
  }

  @Put(':nutritionId')
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  updateNutrition(
    @CurrentUser() payload: JWTPayload,
    @Param('nutritionId', ParseIntPipe) nutritionId: number,
    @Body() nutrition: updateNutritionDto,
  ) {
    return this.nutritionService.updateNutrition(payload.id, nutritionId, nutrition);
  }
}
