import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { ExerciseService } from './exercises.service';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayload } from 'src/utils/types';
import { CreateExerciseDto } from './dtos/createExercise.dto';
import { UpdateExerciseDto } from './dtos/updateExercise.dto';

@Controller('api/exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  public async createExercise(
    @CurrentUser() payload: JWTPayload,
    @Body() newExercise: CreateExerciseDto,
  ) {
    return this.exerciseService.createExercise(payload.id, newExercise);
  }

  @Put('/:exerciseId')
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  public async updateExercise(
    @CurrentUser() payload: JWTPayload,
    @Param('exerciseId') exerciseId: number,
    @Body() updateExercise: UpdateExerciseDto,
  ) {
    return this.exerciseService.updateExercise(
      payload.id,
      exerciseId,
      updateExercise,
    );
  }

  @Delete('/:exerciseId')
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  public async deleteExercise(
    @CurrentUser() payload: JWTPayload,
    @Param('exerciseId') exerciseId: number,
  ) {
    return this.exerciseService.deleteExercise(payload.id, exerciseId);
  }
}
