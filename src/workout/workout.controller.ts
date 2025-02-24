import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe, Put } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayload } from 'src/utils/types';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { WorkoutDto } from './dtos/createCompletWorkout.dto';

@Controller('api/workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}
  @Post()
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  createWorkout(
    @CurrentUser() payload: JWTPayload,
    @Body() workout: WorkoutDto,
  ) {
    return this.workoutService.createCompletedWorkout(payload.id, workout);
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

  @Put('/aprove-workouts/:workoutId')
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  approveWorkout(
    @CurrentUser() payload: JWTPayload,
    @Param('workoutId', ParseIntPipe) workoutId: number,
  ) {
    return this.workoutService.aproveWorkout(payload.id, workoutId);
  }
}
