import { IsOptional } from 'class-validator';
import { IsStringOrNumber } from 'src/users/decorators/stringOrnumber.decorator';

export class CreateExercisesDto {
  exercise: string;
  sets: number;
  @IsOptional()
  @IsStringOrNumber({ message: 'exerciseReps must be a string or number' })
  reps?: string | number;
  duration?: string;
}
