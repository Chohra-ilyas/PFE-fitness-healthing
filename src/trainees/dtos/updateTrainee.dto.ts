import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Gender, Goal } from 'src/utils/enums';

export class UpdateTraineeDto {
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  age: number;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  height: number;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @IsEnum(Goal)
  @IsOptional()
  goal: Goal;
}
