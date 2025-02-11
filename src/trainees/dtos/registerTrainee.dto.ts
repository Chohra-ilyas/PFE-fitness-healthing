import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Gender, Goal } from 'src/utils/enums';

export class RegisterTraineeDto {
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  height: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(Goal)
  goal: Goal;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  chronicalDiseases?: string;
}
