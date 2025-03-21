import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { StringOrNumberTransformer } from 'src/utils/types';

// 1) EXERCISE DTO
export class ExerciseDto {
  @IsString()
  @IsNotEmpty()
  exercise: string;

  @IsNumber()
  @IsPositive()
  sets: number;

  @IsOptional()
  @Transform(({ value }) => new StringOrNumberTransformer().from(value))
  reps?: string | number;

  @IsOptional()
  @IsString()
  duration?: string;
}

// 2) DAY DTO
export class DayDto {
  @IsInt()
  @Min(1)
  @Max(7)
  day: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises: ExerciseDto[];
}

// 3) WORKOUT DTO
export class WorkoutDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // Exactly 7 days required
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayDto)
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  days: DayDto[];
}

// 4) ROOT DTO (Wraps the entire JSON)
export class RootDto {
  @ValidateNested()
  @Type(() => WorkoutDto)
  workout: WorkoutDto;
}
