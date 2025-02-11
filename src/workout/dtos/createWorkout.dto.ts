import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  workoutName: string;
}