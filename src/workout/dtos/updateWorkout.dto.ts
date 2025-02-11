import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateWorkoutDto {
  @IsString()
  @IsOptional()
  workoutName?: string;

  @IsBoolean()
  @IsOptional()
  workoutStatus?: boolean;

  @IsString()
  @IsOptional()
  workoutGenerator?: string;
}