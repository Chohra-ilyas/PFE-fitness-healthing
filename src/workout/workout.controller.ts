import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe, Put } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { CreateWorkoutDto } from './dtos/createWorkout.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayload } from 'src/utils/types';
import { AuthGuard } from 'src/users/guards/auth.guard';

@Controller('api/workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}
  @Post()
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  createWorkout(
    @CurrentUser() payload: JWTPayload,
    @Body() workout: CreateWorkoutDto,
  ) {
    return this.workoutService.createWorkout(payload.id, workout);
  }

  @Get('/pending-workouts')
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  getWorkoutsByTrainer(@CurrentUser() payload: JWTPayload) {
    return this.workoutService.getWorkoutsPendingByTrainer(payload.id);
  }

  @Get('/:workoutId')
  @UseGuards(AuthGuard)
  getAllWorkouts(@Param('workoutId', ParseIntPipe) workoutId: number) {
    return this.workoutService.getsingleWorkout(workoutId);
  }

  @Put('/pending-workouts/:workoutId')
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  aprooveWorkout(
    @CurrentUser() payload: JWTPayload,
    @Param('workoutId', ParseIntPipe) workoutId: number,
  ) {
    return this.workoutService.aproveWorkout(payload.id, workoutId);
  }
}
