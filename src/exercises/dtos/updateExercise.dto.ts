import { IsOptional, IsString, IsNumber } from 'class-validator';
import { IsStringOrNumber } from 'src/users/decorators/stringOrnumber.decorator';

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  exerciseName?: string;

  @IsOptional()
  @IsNumber()
  exerciseSets?: number;

  @IsOptional()
  @IsStringOrNumber()
  exerciseReps?: string | number;

  @IsOptional()
  @IsString()
  exerciseDuration?: string;
}