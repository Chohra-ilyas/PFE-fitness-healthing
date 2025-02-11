import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateDayDto {
  @IsNotEmpty({ message: 'Day name is required' })
  @IsString({ message: 'Day name must be a string' })
  dayName: string;

  @IsNotEmpty({ message: 'Day number is required' })
  @IsNumber({}, { message: 'Day number must be a number' })
  @Min(1, { message: 'Day number must be at least 1' })
  @Max(31, { message: 'Day number cannot exceed 31' })
  dayNumber: number;

  @IsNotEmpty({ message: 'Workout ID is required' })
  @IsNumber({}, { message: 'Workout ID must be a number' })
  workoutId: number;
}